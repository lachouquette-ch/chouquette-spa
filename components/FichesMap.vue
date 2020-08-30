<template>
  <div class="map">
    <div ref="map" class="h-100 w-100" />
    <button
      v-if="!!countNextFiches"
      class="map-load-more google-map-control bg-yellow w-auto"
      :disabled="loading || !countNextFiches"
      title="Afficher plus de fiches"
      @click="$emit('fetchMoreFiches')"
    >
      <b-spinner v-show="loading" small variant="grey" label="chargement" class="mr-1"></b-spinner>
      <strong>+{{ countNextFiches }}</strong>
      <sub>Fiches</sub>
    </button>
  </div>
</template>

<script>
import Vue from 'vue'
import MarkerClusterer from '@google/markerclustererplus'

import { mapState } from 'vuex'
import { CLUSTER_STYLES, MAP_OPTIONS, Z_INDEXES, ZOOM_LEVELS, LAUSANNE_LAT_LNG } from '~/constants/mapSettings'
import FicheInfoWindow from '~/components/FicheInfoWindow'

// create classes from components to use it in code
const FicheInfoWindowClass = Vue.extend(FicheInfoWindow)

export default {
  props: {
    fiches: {
      type: Array,
      required: true,
    },
    selectedFiche: {
      type: Object,
      default: null,
    },
    countNextFiches: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      google: null,
      map: null,
      markers: new Map(),
      currentMarker: null,
      infoWindows: new Map(),
      currentInfoWindow: null,
      markerClusterer: null,
      isMapShown: null,
    }
  },
  computed: {
    ...mapState({
      media: (state) => state.media.all,
    }),
  },
  watch: {
    // the callback will be called immediately after the start of the observation
    fiches: 'loadFichesOnMap',
  },
  async mounted() {
    // build map
    this.google = await this.$googleMaps
    this.map = new this.google.maps.Map(this.$refs.map, {
      ...MAP_OPTIONS,
    })

    // create cluster
    this.markerClusterer = new MarkerClusterer(this.map, [], {
      averageCenter: true,
      styles: CLUSTER_STYLES,
      calculator: (markers, clusterIconStylesCount) => {
        const index = markers.find((marker) => marker.chouquettise) ? 2 : 1
        return {
          index,
          text: markers.length,
        }
      },
    })

    // create map controls
    const centerControlButton = document.createElement('button')
    centerControlButton.className = 'google-map-control'
    centerControlButton.title = 'Voir toutes les fiches sur la carte'
    const centerControlButtonContent = document.createElement('i')
    centerControlButtonContent.className = 'far fa-map'
    centerControlButton.appendChild(centerControlButtonContent)
    centerControlButton.addEventListener('click', () => this.resetMap())
    this.map.controls[this.google.maps.ControlPosition.RIGHT_TOP].push(centerControlButton)

    this.loadFichesOnMap()
  },
  methods: {
    clear() {
      // map
      this.markers.clear()
      this.currentMarker = null
      this.infoWindows.clear()
      this.currentInfoWindow = null
      this.markerClusterer.clearMarkers()
    },
    gotoMarker(fiche) {
      this.resetMapObjects()
      this.isMapShown = true

      this.currentMarker = this.markers.get(fiche.id)
      this.map.setZoom(ZOOM_LEVELS.activated)
      this.map.setCenter(this.currentMarker.getPosition())
      this.currentInfoWindow = this.infoWindows.get(fiche.id)
      this.currentInfoWindow.open(this.map, this.currentMarker)
    },
    resetMapObjects() {
      if (this.currentMarker) {
        this.currentMarker.setZIndex(this.currentMarker.defaultZIndex)
      }
      if (this.currentInfoWindow) {
        this.currentInfoWindow.close()
      }
    },
    resetMap() {
      this.resetMapObjects()

      // need to fit map twice... (magic)
      if (this.markers.size) {
        this.$nextTick(() => this.markerClusterer.fitMapToMarkers())
      } else {
        this.map.setCenter(LAUSANNE_LAT_LNG)
      }

      this.currentMarker = this.markers.values().next().value
      this.currentInfoWindow = this.infoWindows.values().next().value

      if (this.markers.size === 1) this.currentInfoWindow.open(this.map, this.currentMarker)
    },
    loadFichesOnMap() {
      this.clear()

      for (const fiche of this.fiches) {
        if (!fiche.info || !fiche.info.location) {
          // eslint-disable-next-line no-console
          console.warn(`${fiche.slug} has no location (not info)`)
          continue
        }

        // build infoWindow content
        const featuredMedia = this.media[fiche.featured_media]
        const ficheInfoWindow = new FicheInfoWindowClass({
          propsData: {
            fiche,
            featuredMedia,
            showBtnAction: () => {
              this.$emit('fichesMapSelection', fiche.id)
            },
          },
        })
        ficheInfoWindow.$mount()

        // create infoWindow
        const infoWindow = new this.google.maps.InfoWindow({
          content: ficheInfoWindow.$el,
        })
        this.infoWindows.set(fiche.id, infoWindow)

        // create marker
        const marker = new this.google.maps.Marker({
          icon: fiche.main_category.marker_icon,
          position: fiche.info.location,
          title: this.$options.filters.heDecode(fiche.title.rendered),
        })
        marker.defaultZIndex = fiche.info.chouquettise ? Z_INDEXES.chouquettise : Z_INDEXES.default
        marker.chouquettise = fiche.info.chouquettise
        marker.setZIndex(marker.defaultZIndex)
        marker.addListener('click', () => {
          this.resetMapObjects()

          marker.setZIndex(Z_INDEXES.selected)
          infoWindow.open(this.map, marker)

          this.currentMarker = marker
          this.currentInfoWindow = infoWindow
        })
        this.markers.set(fiche.id, marker)
      }

      this.markerClusterer.addMarkers(Array.from(this.markers.values()))

      // reset map
      this.resetMap()
    },
  },
}
</script>

<style lang="scss" scoped>
.map {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: $zindex-fixed + 1;
  height: calc(100% - #{$header-height} - #{$header-banner-height});
}

.map-load-more {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
