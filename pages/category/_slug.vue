<template>
  <div class="category-page layout-content">
    <div class="fiches">
      <div class="container my-4">
        <h1 class="text-center mb-4">{{ category.name }}</h1>
        <div class="h3">Ma recherche</div>
        <div class="d-flex justify-content-around flex-wrap my-4">
          <Fiche v-for="fiche in fiches" :key="fiche.id" :fiche="fiche" :responsive="false" class="mx-2 mb-3" />
        </div>
      </div>
    </div>

    <div class="map" :class="{ 'hide-map': !isMapShown }">
      <div ref="map" class="h-100 w-100" />
    </div>

    <div class="fiches-map-toggle-buttons d-md-none btn-group btn-group-toggle" data-toggle="buttons">
      <label
        class="btn btn-sm btn-primary border-white border-right-0"
        :class="{ active: !isMapShown }"
        @click="isMapShown = false"
      >
        <input id="showFiche" type="radio" name="options" :checked="!isMapShown" />Fiches
      </label>
      <label
        class="btn btn-sm btn-primary border-white border-left-0"
        :class="{ active: isMapShown }"
        @click="isMapShown = true"
      >
        <input id="showMap" type="radio" name="options" :checked="isMapShown" />Carte
      </label>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import MarkerClusterer from '@google/markerclustererplus'

import Fiche from '~/components/Fiche'
import { MAP_OPTIONS, Z_INDEXES, ZOOM_LEVELS, CLUSTER_CLASS, CLUSTER_STYLES } from '~/constants/mapSettings'
import FicheInfoWindow from '~/components/FicheInfoWindow'

// create class from component to use it in code
const FicheInfoWindowClass = Vue.extend(FicheInfoWindow)

export default {
  components: { Fiche },
  async asyncData({ store, params }) {
    const category = await store.dispatch('categories/fetchBySlug', params.slug)
    const subCategories = store.state.categories.children[category.id] // fetched along category

    const subCategoryIds = subCategories.map(({ id }) => id)
    const ficheResult = await store.dispatch('fiches/fetchByCategoryIds', {
      categoryIds: [category.id, ...subCategoryIds]
    })

    return {
      category,
      fiches: ficheResult.fiches,
      fichesTotal: ficheResult.total,
      fichesPages: ficheResult.pages,
      fichesNextPage: 2,
      fichesLoading: false
    }
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

      isMapShown: false
    }
  },
  created() {
    this.$store.dispatch('menus/setSelectedCategory', this.category)
  },
  async mounted() {
    try {
      this.google = await this.$googleMaps
      this.map = new this.google.maps.Map(this.$refs.map, {
        ...MAP_OPTIONS
      })
    } catch (err) {
      if (err instanceof Error) console.error(err)
      else throw err
    }

    this.markerClusterer = new MarkerClusterer(this.map, [], {
      averageCenter: true,
      styles: CLUSTER_STYLES,
      clusterClass: CLUSTER_CLASS,
      calculator: (markers, clusterIconStylesCount) => {
        const index = markers.find((marker) => marker.chouquettise) ? 2 : 1
        return {
          index,
          text: markers.length
        }
      }
    })

    this.loadMap(this.fiches)
  },
  methods: {
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

      this.markerClusterer.fitMapToMarkers()

      this.currentMarker = this.markers.values().next().value
      this.currentInfoWindow = this.infoWindows.values().next().value

      if (this.markers.size === 1) this.currentInfoWindow.open(this.map, this.currentMarker)
    },
    loadMap(fiches) {
      for (const fiche of fiches) {
        if (!fiche.info || !fiche.info.location) {
          console.warn(`${fiche} has no location (not info)`)
          continue
        }

        // build infoWindow content
        const featuredMedia = this.$store.state.media.all[fiche.featured_media]
        const ficheInfoWindow = new FicheInfoWindowClass({
          propsData: { fiche, featuredMedia }
        })
        ficheInfoWindow.$mount()

        // create infoWindow
        const infoWindow = new this.google.maps.InfoWindow({
          content: ficheInfoWindow.$el
        })
        this.infoWindows.set(fiche.id, infoWindow)

        // create marker
        const marker = new this.google.maps.Marker({
          icon: fiche.main_category.marker_icon,
          position: fiche.info.location,
          title: fiche.title.rendered
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

      // init map
      this.resetMap()
    }
  }
}
</script>

<style lang="scss" scoped>
.fiches {
  @include media-breakpoint-up(md) {
    margin-right: 50vw;
  }
}

.map {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: $zindex-sticky;
  height: calc(100vh - #{$header-height} - #{$covid-banner-height});

  @include media-breakpoint-up(md) {
    width: 50vw;
  }
}

.hide-map {
  @include media-breakpoint-down(sm) {
    visibility: hidden;
  }
}

.fiches-map-toggle-buttons {
  @include toggle-buttons;
}
</style>
