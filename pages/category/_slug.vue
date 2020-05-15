<template>
  <div class="category-page layout-content">
    <b-overlay :show="loading" variant="white" z-index="2000" spinner-variant="yellow">
      <div class="position-relative">
        <div class="fiches pt-3 pb-5">
          <div class="container">
            <div class="text-center">
              <h1 class="mb-0">{{ rootCategory.name }}</h1>
              <span class="d-none d-md-inline muted">{{ fichesTotal }} résultats ({{ fiches.length }} affichés)</span>
            </div>
            <div class="search border rounded">
              <div class="btn-group search-button" role="group" aria-label="Recherche">
                <button v-b-toggle.search class="btn btn-sm btn-light-grey">
                  <i v-if="isSearchVisible" class="fas fa-minus"></i>
                  <i v-else class="fas fa-plus"></i>
                  <span class="ml-2">Ma recherche</span>
                </button>
                <b-dropdown v-if="$v.formSearch.$dirty" size="sm" text="Small" variant="primary" split right>
                  <template #button-content @click="searchFiches">
                    <i class="fas fa-search"></i>
                    <span class="d-none d-md-inline ml-2">Rechercher</span>
                  </template>
                  <b-dropdown-item href="#" variant="dark-grey" link-class="small" @click="searchReset">
                    <span class="mr-2">Annuler</span>
                    <span class="float-right"><i class="fas fa-times"></i></span>
                  </b-dropdown-item>
                  <b-dropdown-item href="#" variant="dark-grey" link-class="small" @click="searchClear">
                    <span class="mr-2">Effacer</span>
                    <span class="float-right"><i class="fas fa-eraser"></i></span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>

              <b-collapse id="search" v-model="isSearchVisible">
                <div class="px-3 pt-4 pb-2">
                  <form>
                    <div class="form-group">
                      <select
                        v-model="formSearch.subCategory"
                        class="form-control form-control-sm"
                        @change="loadCriteria(), $v.formSearch.$touch()"
                      >
                        <option :value="null">Que cherches-tu ?</option>
                        <option v-for="category in subCategories" :key="category.id" :value="category">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>
                    <div class="form-group">
                      <select
                        v-model="formSearch.location"
                        class="form-control form-control-sm"
                        @change="$v.formSearch.$touch"
                      >
                        <option :value="null">Où veux-tu aller ?</option>
                        <option
                          v-for="location in flatLocations"
                          :key="location.id"
                          :value="location"
                          :class="{ 'font-weight-bold': !location.level }"
                        >
                          {{ '&nbsp;'.repeat(location.level * 2) }}{{ location.name }}
                        </option>
                      </select>
                    </div>
                    <div class="d-bock d-md-none">
                      <div v-for="criteria in formSearch.criteria" :key="criteria.id" class="form-group">
                        <select
                          v-model="criteria.selectedValues"
                          class="form-control form-control-sm"
                          multiple
                          @change="$v.formSearch.$touch"
                        >
                          <option v-for="value in criteria.values" :key="`${criteria.id}-${value.id}`" :value="value">
                            {{ value.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="d-none d-md-block">
                      <b-overlay :show="criteriaLoading" opacity="0.6" blur="none" spinner-variant="yellow">
                        <fieldset v-for="criteria in formSearch.criteria" :key="criteria.id" class="border my-3 px-3">
                          <legend class="h6 w-auto px-3 m-0">{{ criteria.name }}</legend>
                          <div class="form-row py-2">
                            <div v-for="value in criteria.values" :key="`${criteria.id}-${value.id}`" class="col-6">
                              <div class="form-check">
                                <input
                                  :id="`${criteria.slug}-${value.slug}`"
                                  type="checkbox"
                                  class="form-check-input"
                                  :checked="isValueChecked(criteria, value)"
                                  @click="toggleValue(criteria, value)"
                                />
                                <label class="form-check-label" :for="`${criteria.slug}-${value.slug}`">
                                  {{ value.name }}
                                </label>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </b-overlay>
                    </div>
                    <div class="form-group">
                      <input
                        v-model="formSearch.search"
                        class="form-control form-control-sm"
                        type="text"
                        placeholder="En quelques mots ..."
                        name="search"
                        @input.once="$v.formSearch.$touch"
                      />
                    </div>
                    <div class="d-flex flex-wrap justify-content-around">
                      <button
                        class="btn btn-sm btn-primary mr-1 flex-fill"
                        :disabled="!$v.formSearch.$dirty"
                        @click.prevent="searchFiches"
                      >
                        <i class="fas fa-search"></i>
                        <span class="ml-2">Rechercher</span>
                      </button>
                      <button
                        class="btn btn-sm btn-light-grey mx-1"
                        :disabled="!$v.formSearch.$dirty"
                        @click.prevent="searchReset"
                      >
                        <i class="fas fa-times"></i>
                        <span class="ml-2">Annuler</span>
                      </button>
                      <button class="btn btn-sm btn-light-grey ml-1" @click.prevent="searchClear">
                        <i class="fas fa-eraser"></i>
                        <span class="ml-2">Effacer</span>
                      </button>
                    </div>
                  </form>
                </div>
              </b-collapse>
              <div v-if="!isSearchVisible" :class="{ 'p-2 pt-4': hasSearchCriteria }">
                <CriteriaBadge
                  v-if="formSearch.subCategory"
                  :name="formSearch.subCategory.name"
                  @remove=";(formSearch.subCategory = null), $v.formSearch.$touch()"
                />
                <CriteriaBadge
                  v-if="formSearch.location"
                  :name="formSearch.location.name"
                  @remove=";(formSearch.location = null), $v.formSearch.$touch()"
                />
                <CriteriaBadge
                  v-if="formSearch.search"
                  :name="formSearch.search"
                  @remove=";(formSearch.search = null), $v.formSearch.$touch()"
                />
                <template v-for="criteria in formSearch.criteria">
                  <CriteriaBadge
                    v-for="value in criteria.selectedValues"
                    :key="value.id"
                    :name="value.name"
                    @remove="toggleValue(criteria, value), $v.formSearch.$touch()"
                  />
                </template>
              </div>
            </div>
          </div>

          <b-overlay :show="fichesLoading" variant="white" opacity="1" spinner-variant="yellow">
            <div class="px-3">
              <template v-if="fiches.length">
                <div v-if="fichesSwiperOptions" v-swiper="fichesSwiperOptions" class="swiper px-md-5">
                  <div class="swiper-wrapper pt-3">
                    <div
                      v-for="(fiche, index) in virtualData.slides"
                      :key="index"
                      class="swiper-slide h-auto d-flex align-items-stretch"
                      :style="{ left: `${virtualData.offset}px` }"
                    >
                      <Fiche :ref="`fiche-${fiche.id}`" class="fiche" :fiche="fiche" :responsive="false">
                        <template #front-footer>
                          <a
                            href=""
                            title="Voir sur la carte"
                            class="btn btn-sm btn-outline-secondary mr-1"
                            @click.prevent="gotoMarker(fiche)"
                          >
                            <span class="mx-1"><i class="fas fa-map-marker-alt"></i></span>
                          </a>
                        </template>
                      </Fiche>
                    </div>
                  </div>
                  <div v-if="!!fiches.length" slot="pagination" class="swiper-pagination" />
                  <div v-if="!!fiches.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
                  <div v-if="!!fiches.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
                </div>
              </template>
              <template v-else>
                <span class="h5 d-block text-center">
                  Pas de résultat pour ta recherche <i class="far fa-surprise"></i>. Essaie de changer tes filtres.
                </span>
              </template>
            </div>
          </b-overlay>
        </div>

        <div class="map" :class="{ 'd-none': !isMapShown }">
          <div ref="map" class="h-100 w-100" />
          <button
            v-if="hasMoreFiche"
            class="map-load-more google-map-control bg-yellow w-auto"
            :disabled="fichesLoading || !hasMoreFiche"
            title="Afficher plus de fiches"
            @click="fetchMoreFiches"
          >
            <b-spinner v-show="fichesLoading" small variant="grey" label="chargement" class="mr-1"></b-spinner>
            <strong>+{{ countNextFiches }}</strong>
            <sub>Fiches</sub>
          </button>
        </div>

        <div class="fiches-map-toggle-buttons btn-group btn-group-toggle" data-toggle="buttons">
          <button class="btn btn-sm btn-primary" :class="{ active: !isMapShown }" @click="isMapShown = false">
            Fiches
          </button>
          <button
            class="btn btn-sm btn-primary"
            :class="{ active: isMapShown }"
            :disabled="!markers.size"
            @click="showMap"
          >
            Carte
          </button>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import Vue from 'vue'
import MarkerClusterer from '@google/markerclustererplus'
import $ from 'jquery'
import { directive as SwiperDirective } from 'vue-awesome-swiper'
import { mapState } from 'vuex'
import _ from 'lodash'

import Fiche from '~/components/Fiche'
import { CLUSTER_STYLES, MAP_OPTIONS, Z_INDEXES, ZOOM_LEVELS, LAUSANNE_LAT_LNG } from '~/constants/mapSettings'
import FicheInfoWindow from '~/components/FicheInfoWindow'
import { DEFAULT, RESPONSIVE } from '~/constants/swiper'
import CriteriaBadge from '~/components/CriteriaBadge'

// create classes from components to use it in code
const FicheInfoWindowClass = Vue.extend(FicheInfoWindow)

const FICHE_NUMBER_EACH = 40

export default {
  components: { CriteriaBadge, Fiche },
  directives: { swiper: SwiperDirective },
  async asyncData({ store, params, query }) {
    const rootCategory = await store.dispatch('categories/fetchBySlug', params.slug)
    const subCategories = store.state.categories.children[rootCategory.id] // fetched along category

    // store initialization
    await store.dispatch('menus/setSelectedCategory', rootCategory)
    await store.dispatch('locations/init')

    // build criteria
    const criteria = Object.entries(query)
      .filter(([key]) => key.startsWith('cq_'))
      .map(([key, value]) => {
        return { taxonomy: key, values: value.split(',') }
      })

    const initSearch = {
      category: query.category || rootCategory.slug,
      location: query.location,
      search: query.search,
      criteria
    }

    const ficheResult = await store.dispatch('fiches/fetchByCategoryIds', {
      ...initSearch,
      per_page: FICHE_NUMBER_EACH
    })

    return {
      rootCategory,
      subCategories,
      initSearch,
      fiches: ficheResult.fiches,
      fichesTotal: ficheResult.total,
      fichesPages: ficheResult.pages,
      fichesNextPage: 2
    }
  },
  data() {
    return {
      // map
      google: null,
      map: null,
      markers: new Map(),
      currentMarker: null,
      infoWindows: new Map(),
      currentInfoWindow: null,
      markerClusterer: null,
      isMapShown: null,

      // search
      isSearchVisible: false,
      formSearch: { subCategory: null, location: null, search: null, criteria: [] },
      criteriaLoading: false,

      // swiper
      fichesLoading: false,
      fichesSwiperOptions: null,
      virtualData: {
        slides: []
      },

      loading: false
    }
  },
  validations() {
    return {
      formSearch: {}
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path === from.path) {
      // build criteria
      const criteria = Object.entries(to.query)
        .filter(([key]) => key.startsWith('cq_'))
        .map(([key, value]) => {
          return { taxonomy: key, values: value.split(',') }
        })

      this.initSearch = {
        category: to.query.category || this.rootCategory.slug,
        location: to.query.location,
        search: to.query.search,
        criteria
      }

      // search form
      this.searchReset()
      this.isSearchVisible = false

      this.$store
        .dispatch('fiches/fetchByCategoryIds', {
          ...this.initSearch,
          per_page: FICHE_NUMBER_EACH
        })
        .then((ficheResult) => {
          // fiches
          this.fiches = ficheResult.fiches
          this.fichesTotal = ficheResult.total
          this.fichesPages = ficheResult.pages
          this.fichesNextPage = 2

          // map
          this.markers.clear()
          this.currentMarker = null
          this.infoWindows.clear()
          this.currentInfoWindow = null
          this.markerClusterer.clearMarkers()
          this.isMapShown = null
          this.loadFichesOnMap(this.fiches)

          // swiper
          this.$swiper.virtual.removeAllSlides()
          this.$swiper.virtual.slides = this.fiches
          this.$swiper.update()
          this.$swiper.virtual.update()
        })
    }
    next()
  },
  computed: {
    hasMoreFiche() {
      return this.fichesNextPage <= this.fichesPages
    },
    countNextFiches() {
      if (this.fichesNextPage < this.fichesPages) {
        return FICHE_NUMBER_EACH
      } else {
        return this.fichesTotal - this.fiches.length
      }
    },
    hasSingleFiche() {
      return this.fiches && this.fiches.length === 1
    },
    ...mapState('locations', {
      locations: 'all',
      locationHierarchy: 'hierarchy'
    }),
    flatLocations() {
      // first level only
      return this.locationHierarchy.reduce(
        (locations, { location, subLocations }) => [...locations, location, ...subLocations],
        []
      )
    },
    hasSearchCriteria() {
      const hasSearch = this.formSearch.subCategory || this.formSearch.location || this.formSearch.searchText
      const hasCriteria = this.formSearch.criteria.find(({ selectedValues }) => _.isEmpty(selectedValues) === false)
      return hasSearch || hasCriteria
    }
  },
  async mounted() {
    this.loading = true

    // criteria
    await this.searchReset()

    // swiper
    this.fichesSwiperOptions = {
      centeredSlides: true,
      virtual: {
        slides: this.fiches,
        renderExternal: (data) => {
          // assign virtual slides data
          this.virtualData = data
        },
        addSlidesBefore: 2,
        addSlidesAfter: 2
      },
      ...DEFAULT,
      ...RESPONSIVE,
      on: {
        reachEnd: () => this.fetchMoreFiches()
      }
    }

    // build map
    this.google = await this.$googleMaps
    this.map = new this.google.maps.Map(this.$refs.map, {
      ...MAP_OPTIONS
    })

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
    centerControlButton.title = 'Voir toutes les fiches sur la carte'
    const centerControlButtonContent = document.createElement('i')
    centerControlButtonContent.className = 'far fa-map'
    centerControlButton.appendChild(centerControlButtonContent)
    centerControlButton.addEventListener('click', () => this.resetMap())
    this.map.controls[this.google.maps.ControlPosition.RIGHT_TOP].push(centerControlButton)

    this.loadFichesOnMap(this.fiches)

    this.loading = false
  },
  methods: {
    // criteria
    toggleValue(criteria, value) {
      this.$v.formSearch.$touch()
      const valueIndex = criteria.selectedValues.findIndex((el) => el.id === value.id)
      if (valueIndex === -1) {
        criteria.selectedValues.push(value)
      } else {
        criteria.selectedValues.splice(valueIndex, 1)
      }
    },
    isValueChecked(criteria, value) {
      return criteria.selectedValues.includes(value)
    },
    async loadCriteria() {
      try {
        this.criteriaLoading = true

        const categoryId = this.formSearch.subCategory ? this.formSearch.subCategory.id : this.rootCategory.id
        const criteriaList = await this.$wpAPI.criteria.getForCategory(categoryId).then(({ data }) => data)

        // build selectedValues "add-on"
        criteriaList.forEach((criteria) => (criteria.selectedValues = []))

        this.formSearch.criteria = criteriaList
      } finally {
        this.criteriaLoading = false
      }
    },

    // map
    showMap() {
      if (this.isMapShown === null) {
        this.isMapShown = true
        this.$nextTick(() => {
          this.resetMap()
        })
      } else {
        this.isMapShown = true
      }
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

      // clear selection
      $('.fiche').removeClass('selected')
    },
    resetMap() {
      this.resetMapObjects()

      // need to fit map twice... (magic)
      if (this.markers.size) {
        this.markerClusterer.fitMapToMarkers()
        this.markerClusterer.fitMapToMarkers()
      } else {
        this.map.setCenter(LAUSANNE_LAT_LNG)
      }

      this.currentMarker = this.markers.values().next().value
      this.currentInfoWindow = this.infoWindows.values().next().value

      if (this.markers.size === 1) this.currentInfoWindow.open(this.map, this.currentMarker)
    },

    // fiches
    async searchClear() {
      this.formSearch.subCategory = null
      await this.loadCriteria()
      this.formSearch.location = null
      this.formSearch.search = null
      this.formSearch.criteria.forEach((criteria) => {
        criteria.selectedValues = []
      })

      this.$v.formSearch.$touch()
    },
    async searchReset() {
      // fields
      if (this.initSearch.category === this.rootCategory.slug) {
        this.formSearch.subCategory = null
      } else {
        this.formSearch.subCategory = this.subCategories.find(({ slug }) => slug === this.initSearch.category)
      }

      this.formSearch.location = this.initSearch.location
        ? Object.values(this.locations).find(({ slug }) => slug === this.initSearch.location)
        : null
      this.formSearch.search = this.initSearch.search

      // criteria
      await this.loadCriteria()
      this.formSearch.criteria.forEach((criteria) => {
        const initCriteria = this.initSearch.criteria.find(({ taxonomy }) => taxonomy === criteria.taxonomy)
        if (initCriteria) {
          criteria.selectedValues = criteria.values.filter(({ slug }) => initCriteria.values.includes(slug))
        }
      })

      this.isSearchVisible = false
      this.$v.formSearch.$reset()
    },
    searchFiches() {
      // build new route and navigate to it
      const query = {}
      if (this.formSearch.subCategory) {
        query.category = this.formSearch.subCategory.slug
      }
      if (this.formSearch.location) {
        query.location = this.formSearch.location.slug
      }
      if (this.formSearch.search) {
        query.search = this.formSearch.search
      }

      // build criteria
      this.formSearch.criteria.forEach(({ taxonomy, selectedValues }) => {
        if (!_.isEmpty(selectedValues)) {
          query[taxonomy] = selectedValues.map(({ slug }) => slug).join(',')
        }
      })

      this.$router.push({ query })
    },
    async fetchMoreFiches() {
      if (this.fichesLoading) {
        console.warn('already loading more fiches')
        return
      }

      if (this.fichesNextPage >= this.fichesPages) {
        console.warn('no more pages')
        return
      }

      this.fichesLoading = true
      try {
        const ficheResult = await this.$store.dispatch('fiches/fetchByCategoryIds', {
          ...this.initSearch,
          page: this.fichesNextPage,
          per_page: FICHE_NUMBER_EACH
        })

        this.fiches.push(...ficheResult.fiches)
        this.$swiper.slideTo(this.$swiper.previousIndex + 1, 0, false)
        this.loadFichesOnMap(ficheResult.fiches)
        this.fichesNextPage++
      } finally {
        this.fichesLoading = false
        if (!this.isMapShown) {
          // need to reinit markerclusterer on next map view
          this.isMapShown = null
        }
      }
    },
    loadFichesOnMap(fiches) {
      for (const fiche of fiches) {
        if (!fiche.info || !fiche.info.location) {
          console.warn(`${fiche.slug} has no location (not info)`)
          continue
        }

        // build infoWindow content
        const featuredMedia = this.$store.state.media.all[fiche.featured_media]
        const ficheInfoWindow = new FicheInfoWindowClass({
          propsData: {
            fiche,
            featuredMedia,
            showBtnAction: () => {
              this.isMapShown = false
              // find fiche
              const ficheIndex = this.fiches.findIndex(({ id }) => id === fiche.id)
              this.$swiper.slideTo(ficheIndex)
            }
          }
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
        })
        this.markers.set(fiche.id, marker)
      }

      this.markerClusterer.addMarkers(Array.from(this.markers.values()))

      // reset map
      this.resetMap()
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  margin: 2rem 0;
}

.search-button {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.swiper-button-prev,
.swiper-button-next {
  top: 250px;
}

.map {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: $zindex-sticky;
  height: calc(100vh - #{$header-height} - #{$covid-banner-height});
}

.map-load-more {
  position: absolute;
  bottom: 0;
  left: 0;
}

.fiches-map-toggle-buttons {
  @include toggle-buttons;

  @include media-breakpoint-up(md) {
    position: fixed;
    top: $header-height + $covid-banner-height + 15px;
    bottom: auto;
    left: 15px;
    transform: none;

    width: 150px;
  }
}
</style>
