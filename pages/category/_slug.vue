<template>
  <div class="category-page layout-content">
    <div class="fiches">
      <div class="container my-4">
        <div class="text-center mb-4">
          <h1 class="mb-0">{{ category.name }}</h1>
          <span class="muted">{{ fichesTotal }} résultats ({{ fiches.length }} affichés)</span>
        </div>
        <div class="h3">Ma recherche</div>
        <div class="d-flex justify-content-around flex-wrap my-4">
          <Fiche
            v-for="fiche in fiches"
            :ref="`fiche-${fiche.id}`"
            :key="fiche.id"
            :fiche="fiche"
            :responsive="false"
            class="fiche mx-2 mb-3"
            @click.native="gotoMarker(fiche)"
          />
        </div>
        <button
          v-b-visible="loadMoreFiches"
          class="btn btn-sm btn-yellow w-100"
          :disabled="loading || !hasMoreFiche"
          @click="loadMoreFiches"
        >
          <b-spinner v-show="loading" small variant="dark-grey" label="chargement" class="mr-2"></b-spinner>
          <span v-if="hasMoreFiche">Voir plus de fiches</span>
          <span v-else>T'es arrivé au bout du bout</span>
        </button>
      </div>
    </div>

    <div class="map" :class="{ 'hide-map': !isMapShown }">
      <div ref="map" class="h-100 w-100" />
      <button v-if="hasMoreFiche" class="map-load-more google-map-control w-auto" :disabled="loading || !hasMoreFiche" @click="loadMoreFiches">
        <b-overlay spinner-variant="grey" spinner-small :show="loading">
          <strong>+{{ countNextFiches }}</strong>
          <sub>Fiches</sub>
        </b-overlay>
      </button>
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
import $ from 'jquery'

import Fiche from '~/components/Fiche'
import { MAP_OPTIONS, Z_INDEXES, ZOOM_LEVELS, CLUSTER_STYLES } from '~/constants/mapSettings'
import FicheInfoWindow from '~/components/FicheInfoWindow'

// create classes from components to use it in code
const FicheInfoWindowClass = Vue.extend(FicheInfoWindow)

export default {
  components: { Fiche },
  async asyncData({ store, params }) {
    const category = await store.dispatch('categories/fetchBySlug', params.slug)
    const subCategories = store.state.categories.children[category.id] // fetched along category

    const subCategoryIds = subCategories.map(({ id }) => id)
    const categoryIds = [category.id, ...subCategoryIds]
    const ficheResult = await store.dispatch('fiches/fetchByCategoryIds', {
      categoryIds
    })

    return {
      category,
      categoryIds,
      fiches: ficheResult.fiches,
      fichesTotal: ficheResult.total,
      fichesPages: ficheResult.pages,
      fichesNextPage: 2
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

      isMapShown: false,
      loading: true
    }
  },
  computed: {
    hasMoreFiche() {
      return this.fichesNextPage <= this.fichesPages
    },
    countNextFiches() {
      if (this.fichesNextPage < this.fichesPages) {
        return Math.ceil(this.fichesTotal / this.fichesPages)
      } else {
        return this.fichesTotal - this.fiches.length
      }
    }
  },
  created() {
    this.$store.dispatch('menus/setSelectedCategory', this.category)
  },
  async mounted() {
    // build map
    try {
      this.google = await this.$googleMaps
      this.map = new this.google.maps.Map(this.$refs.map, {
        ...MAP_OPTIONS
      })
    } catch (err) {
      if (err instanceof Error) console.error(err)
      else throw err
    }

    // create cluster
    this.markerClusterer = new MarkerClusterer(this.map, [], {
      averageCenter: true,
      styles: CLUSTER_STYLES,
      calculator: (markers, clusterIconStylesCount) => {
        const index = markers.find((marker) => marker.chouquettise) ? 2 : 1
        return {
          index,
          text: markers.length
        }
      }
    })

    // create map controls
    const centerControlButton = document.createElement('button')
    centerControlButton.className = 'google-map-control'
    const centerControlButtonContent = document.createElement('i')
    centerControlButtonContent.className = 'far fa-map'
    centerControlButton.appendChild(centerControlButtonContent)
    centerControlButton.addEventListener('click', () => this.resetMap())
    this.map.controls[this.google.maps.ControlPosition.TOP_LEFT].push(centerControlButton)

    this.loadFiches(this.fiches)
    this.loading = false
  },
  methods: {
    gotoMarker(fiche) {
      this.resetMapObjects()

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

      // clear selection
      $('.fiche').removeClass('selected')
    },
    resetMap() {
      this.resetMapObjects()

      this.markerClusterer.fitMapToMarkers()

      this.currentMarker = this.markers.values().next().value
      this.currentInfoWindow = this.infoWindows.values().next().value

      if (this.markers.size === 1) this.currentInfoWindow.open(this.map, this.currentMarker)
    },
    async loadMoreFiches() {
      if (this.loading) {
        console.warn('already loading more fiches')
        return
      }

      if (!this.hasMoreFiche) {
        console.warn('no more fiche to load')
        return
      }

      this.loading = true
      try {
        const ficheResult = await this.$store.dispatch('fiches/fetchByCategoryIds', {
          categoryIds: this.categoryIds,
          page: this.fichesNextPage
        })
        this.fichesNextPage++

        this.loadFiches(ficheResult.fiches)
        this.fiches.push(...ficheResult.fiches)
      } finally {
        this.loading = false
      }
    },
    loadFiches(fiches) {
      for (const fiche of fiches) {
        if (!fiche.info || !fiche.info.location) {
          console.warn(`${fiche.slug} has no location (not info)`)
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
          title: this.$options.filters.heDecode(fiche.title.rendered)
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

          const ficheElmt = this.$refs[`fiche-${fiche.id}`][0]
          this.$scrollTo(ficheElmt.$el, 600, {
            offset: -160
          })
          $(ficheElmt.$el).addClass('selected')
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

::v-deep .fiche.selected {
  article {
    box-shadow: $box-shadow;
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

.map-load-more {
  position: absolute;
  bottom: 0;
  left: 0;
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
