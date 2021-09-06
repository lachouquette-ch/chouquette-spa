<template>
  <div class="map" style="position: relative">
    <v-overlay :value="ficheLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div ref="map" style="height: 100%; width: 100%" />
    <div
      v-if="!preview"
      style="position: absolute; top: 0; width: 100vw; padding-top: 20px"
      class="d-flex justify-center"
    >
      <v-btn v-if="hasMoreFiches" :loading="fetchLoading" small rounded class="white" @click="$emit('moreFiches')">
        Plus de fiches
        <v-icon right>mdi-cloud-upload</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import MarkerClusterer from '@googlemaps/markerclustererplus'

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
    hasMoreFiches: {
      type: Boolean,
      default: true,
    },
    ficheLoading: {
      type: Boolean,
      default: false,
    },
    fetchLoading: {
      type: Boolean,
      default: false,
    },
    preview: {
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
  watch: {
    fiches() {
      this.loadFichesOnMap()
    },
  },
  async mounted() {
    // build map
    this.google = await this.$googleMaps
    this.map = new this.google.maps.Map(this.$refs.map, {
      ...MAP_OPTIONS,
      zoomControlOptions: {
        position: this.google.maps.ControlPosition.TOP_RIGHT,
      },
    })

    // create cluster
    this.markerClusterer = new MarkerClusterer(this.map, [], {
      averageCenter: true,
      styles: CLUSTER_STYLES,
      calculator: (markers, clusterIconStylesCount) => {
        const index = markers.find((marker) => marker.isChouquettise) ? 2 : 1
        return {
          index,
          text: markers.length,
        }
      },
    })

    // map specificities
    if (this.preview) {
      this.map.gestureHandling = 'none'
      this.map.setOptions({
        fullscreenControl: true,
        fullscreenControlOptions: { position: this.google.maps.ControlPosition.TOP_LEFT },
      })
    } else {
      // create map controls
      const centerControlButton = document.createElement('button')
      centerControlButton.className = 'google-map-control'
      centerControlButton.title = 'Voir toutes les fiches sur la carte'
      const centerControlButtonContent = document.createElement('i')
      // centerControlButtonContent.className = 'material-icons'
      centerControlButtonContent.className = 'mdi mdi-arrow-expand-all gm-control-active'
      centerControlButtonContent.style = 'color: #666666; font-size: 30px; font-weight: bold;'
      centerControlButton.appendChild(centerControlButtonContent)
      centerControlButton.addEventListener('click', () => this.resetMap())
      this.map.controls[this.google.maps.ControlPosition.TOP_LEFT].push(centerControlButton)
    }

    // fullscreen handler
    let fullScreen = false
    document.onfullscreenchange = () => {
      if (fullScreen) {
        this.$emit('fullScreenOff')
        console.log('fullScreenOff')
        fullScreen = false
        if (this.preview) {
          this.map.gestureHandling = 'none'
          this.resetMap()
        }
      } else {
        this.$emit('fullScreenOn')
        console.log('fullScreenOn')
        fullScreen = true
        if (this.preview) {
          this.map.gestureHandling = 'greedy'
        }
      }
    }

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
        this.$nextTick(() => this.markerClusterer.fitMapToMarkers({ top: 5, right: 5, bottom: 64, left: 5 }))
      } else {
        this.map.setCenter(LAUSANNE_LAT_LNG)
      }

      this.currentMarker = this.markers.values().next().value
      this.currentInfoWindow = this.infoWindows.values().next().value

      if (this.preview) setTimeout(() => this.map.setZoom(ZOOM_LEVELS.default), 1000)
      else if (this.markers.size === 1) this.currentInfoWindow.open(this.map, this.currentMarker)
    },
    loadFichesOnMap() {
      this.clear()

      for (const fiche of this.fiches) {
        if (!fiche.poi) {
          continue
        }

        // build infoWindow content
        const ficheInfoWindow = new FicheInfoWindowClass({
          propsData: {
            fiche,
            btnAction: () => {
              this.$emit('mapSelectFiche', fiche)
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
          icon: fiche.poi.marker,
          position: fiche.poi,
          title: fiche.title,
        })
        marker.defaultZIndex = fiche.isChouquettise ? Z_INDEXES.chouquettise : Z_INDEXES.default
        marker.chouquettise = fiche.isChouquettise
        marker.setZIndex(marker.defaultZIndex)
        if (!this.preview) {
          marker.addListener('click', () => {
            this.resetMapObjects()

            marker.setZIndex(Z_INDEXES.selected)
            infoWindow.open(this.map, marker)

            this.currentMarker = marker
            this.currentInfoWindow = infoWindow
          })
        }
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
  height: 100%;
  width: 100%;
}

// hack google map style

::v-deep .gm-style-iw.gm-style-iw-c {
  padding: 0 !important;
}

::v-deep .gm-style-iw-d {
  overflow: hidden !important;
}
</style>
