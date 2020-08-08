<template>
  <div class="position-relative" style="min-height: 75vh;">
    <div class="fiches py-3">
      <div class="container">
        <div class="text-center">
          <h1 class="mb-0">{{ title }}</h1>
          <span v-if="fiches.length" class="d-none d-md-inline muted">
            {{ fichesTotal }} résultats ({{ fiches.length }} affichés)
          </span>
        </div>
        <div class="search border rounded">
          <div class="btn-group search-button text-nowrap" role="group" aria-label="Recherche">
            <button v-b-toggle.search class="btn btn-sm btn-light-grey">
              <i v-if="isSearchVisible" class="fas fa-minus"></i>
              <i v-else class="fas fa-plus"></i>
              <span class="ml-2">Ma recherche</span>
            </button>
            <b-dropdown v-if="$v.formSearch.$dirty" size="sm" text="Small" variant="primary" split right>
              <template #button-content>
                <div @click="searchFiches">
                  <span class="ml-2"><i class="fas fa-search"></i></span>
                  <span class="d-none d-md-inline ml-2">Rechercher</span>
                </div>
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
                <div class="form-group mb-0 mb-md-3">
                  <label for="category" class="small mb-0 d-md-none">Sous catégorie</label>
                  <select
                    id="category"
                    v-model="formSearch.category"
                    class="form-control form-control-sm"
                    @change="loadCriteria(), $v.formSearch.$touch()"
                  >
                    <option :value="null">Que cherches-tu ?</option>
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category"
                      :class="{ 'font-weight-bold': !rootCategory && !category.level }"
                    >
                      <template v-if="!rootCategory">{{ '&nbsp;'.repeat(category.level * 2) }}</template>
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                <div v-if="locations" class="form-group mb-0 mb-md-3">
                  <label for="location" class="small mb-0 d-md-none">Lieu</label>
                  <select
                    id="location"
                    v-model="formSearch.location"
                    class="form-control form-control-sm"
                    @change="$v.formSearch.$touch"
                  >
                    <option :value="null">Où veux-tu aller ?</option>
                    <option
                      v-for="location in locations"
                      :key="location.id"
                      :value="location"
                      :class="{ 'font-weight-bold': !rootLocation && !location.level }"
                    >
                      <template v-if="!rootLocation">{{ '&nbsp;'.repeat(location.level * 2) }}</template>
                      {{ location.name }}
                    </option>
                  </select>
                </div>
                <div class="d-bock d-md-none">
                  <b-overlay :show="criteriaLoading" opacity="0.6" blur="none" spinner-variant="yellow">
                    <div v-for="criteria in formSearch.criteria" :key="criteria.id" class="form-group mb-0 mb-md-3">
                      <label :for="criteria.taxonomy" class="small mb-0">{{ criteria.name }}</label>
                      <select
                        :id="criteria.taxonomy"
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
                  </b-overlay>
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
                  <label for="search" class="small mb-0 d-md-none">Recherche libre</label>
                  <input
                    id="search"
                    v-model="formSearch.search"
                    class="form-control form-control-sm"
                    type="text"
                    placeholder="En quelques mots ..."
                    name="search"
                    @input.once="$v.formSearch.$touch"
                  />
                </div>
                <div class="d-flex justify-content-around">
                  <button
                    class="btn btn-sm btn-primary mr-1 flex-fill"
                    :disabled="!$v.formSearch.$dirty"
                    @click.prevent="searchFiches"
                  >
                    <span class="mr-2"><i class="fas fa-search"></i></span>
                    <span>Rechercher</span>
                  </button>
                  <button
                    class="btn btn-sm btn-light-grey mr-1"
                    :disabled="!$v.formSearch.$dirty"
                    @click.prevent="searchReset"
                  >
                    <span class="mr-2"><i class="fas fa-times"></i></span>
                    <span>Annuler</span>
                  </button>
                  <button class="btn btn-sm btn-light-grey ml-1" @click.prevent="searchClear">
                    <span class="mr-2"><i class="fas fa-eraser"></i></span>
                    <span>Effacer</span>
                  </button>
                </div>
              </form>
            </div>
          </b-collapse>
          <div v-if="!isSearchVisible" :class="{ 'p-2 pt-4': hasSearchCriteria }">
            <CriteriaBadge
              v-if="formSearch.category"
              :name="formSearch.category.name"
              @remove=";(formSearch.category = null), $v.formSearch.$touch()"
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

      <b-overlay
        :show="$fetchState.pending || loading"
        variant="white"
        opacity="1"
        z-index="1030"
        spinner-variant="yellow"
      >
        <main id="category-main" class="container" style="min-height: 50vh;">
          <div class="d-flex flex-wrap justify-content-around">
            <Fiche v-for="fiche in fiches" :key="fiche.id" :ref="`fiche-${fiche.id}`" :fiche="fiche" class="fiche m-3">
              <template v-if="map" #front-footer>
                <a
                  href=""
                  title="Voir sur la carte"
                  class="btn btn-sm btn-outline-secondary"
                  @click.prevent="gotoMarker(fiche)"
                >
                  <span class="mx-1"><i class="fas fa-map-marker-alt"></i></span>
                </a>
              </template>
            </Fiche>
          </div>
          <div class="d-block text-center">
            <button
              v-if="fiches.length"
              class="btn btn-outline-secondary my-3 w-50"
              :disabled="fichesLoading || !hasMoreFiches"
              @click="fetchMoreFiches"
            >
              <b-spinner v-show="fichesLoading" small variant="grey" label="chargement" class="mr-1"></b-spinner>
              Plus de résultats
            </button>
            <span v-else-if="fichesTotal === 0" class="h5">
              Pas de résultat pour ta recherche <i class="far fa-surprise"></i>. Essaie de changer tes filtres.
            </span>
          </div>
        </main>
      </b-overlay>
    </div>

    <div class="map" :class="{ 'd-none': !isMapShown }">
      <div ref="map" class="h-100 w-100" />
      <button
        v-if="hasMoreFiches"
        class="map-load-more google-map-control bg-yellow w-auto"
        :disabled="fichesLoading || !hasMoreFiches"
        title="Afficher plus de fiches"
        @click="fetchMoreFiches"
      >
        <b-spinner v-show="fichesLoading" small variant="grey" label="chargement" class="mr-1"></b-spinner>
        <strong>+{{ countNextFiches }}</strong>
        <sub>Fiches</sub>
      </button>
    </div>

    <ToggleButtons v-if="map" :btn2disabled="!markers.size" @btn1action="isMapShown = false" @btn2action="showMap">
      <template #button1>
        <span class="mr-1"><i class="far fa-file-alt"></i></span>
        Fiches
      </template>
      <template #button2>
        <span class="mr-1"><i class="fas fa-map-marked-alt"></i></span>
        Carte
      </template>
    </ToggleButtons>

    <ScrollTop v-show="!isMapShown" />
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
import { PER_PAGE_NUMBER } from '~/constants/default'
import CriteriaBadge from '~/components/CriteriaBadge'
import ToggleButtons from '~/components/ToggleButtons'
import ScrollTop from '~/components/ScrollTop'

// create classes from components to use it in code
const FicheInfoWindowClass = Vue.extend(FicheInfoWindow)

export default {
  components: { ToggleButtons, CriteriaBadge, Fiche, ScrollTop },
  directives: { swiper: SwiperDirective },
  props: {
    /* eslint-disable vue/require-default-prop */
    rootCategory: Object,
    rootLocation: Object,

    queryCategory: String,
    queryLocation: String,
    querySearch: String,
    queryCriteria: Array,
    /* eslint-enable vue/require-default-prop */
  },
  async fetch() {
    const ficheResult = await this.$store.dispatch('fiches/fetchByCategoryIds', {
      category: this.queryCategory,
      location: this.queryLocation,
      search: this.querySearch,
      criteria: this.queryCriteria,
      per_page: PER_PAGE_NUMBER,
    })

    this.fiches = ficheResult.fiches
    this.fichesTotal = ficheResult.total
    this.fichesPages = ficheResult.pages
    this.fichesNextPage++

    this.loadFichesOnMap(this.fiches)
  },
  data() {
    return {
      // initialize component
      defaultCategory: this.queryCategory,
      categories: [],
      defaultLocation: this.queryLocation,
      locations: [],
      defaultSearch: this.querySearch,
      defaultCriteria: this.queryCriteria,

      fiches: [],
      fichesTotal: null,
      fichesPages: null,
      fichesNextPage: 1,

      // map
      google: null,
      map: null,
      markers: new Map(),
      currentMarker: null,
      infoWindows: new Map(),
      currentInfoWindow: null,
      markerClusterer: null,
      isMapShown: null,

      // search form
      isSearchVisible: false,
      formSearch: { category: null, location: null, search: null, criteria: [] },
      criteriaLoading: false,

      fichesLoading: false,
      loading: false,
    }
  },
  validations() {
    return {
      formSearch: {},
    }
  },
  computed: {
    ...mapState('locations', {
      locationAll: 'all',
      locationHierarchy: 'hierarchy',
    }),
    ...mapState('categories', {
      categoryAll: 'all',
      categoryHierarchy: 'hierarchy',
    }),
    ...mapState('menus', {
      categoryMenu: 'headerCategories',
    }),
    title() {
      return this.rootCategory ? this.rootCategory.name : this.rootLocation.name
    },
    hasMoreFiches() {
      return this.fichesNextPage <= this.fichesPages
    },
    countNextFiches() {
      if (this.fichesNextPage < this.fichesPages) {
        return PER_PAGE_NUMBER
      } else {
        return this.fichesTotal - this.fiches.length
      }
    },
    hasSingleFiche() {
      return this.fiches && this.fiches.length === 1
    },
    hasSearchCriteria() {
      const hasSearch = this.formSearch.category || this.formSearch.location || this.formSearch.searchText
      const hasCriteria = this.formSearch.criteria.find(({ selectedValues }) => _.isEmpty(selectedValues) === false)
      return hasSearch || hasCriteria
    },
  },
  async mounted() {
    // create lists
    if (this.rootCategory) {
      this.categories = await this.$store.dispatch('categories/findChildren', this.rootCategory)
    } else {
      this.categories = Object.entries(this.categoryHierarchy).flatMap(([categoryId, children]) => [
        this.categoryAll[categoryId],
        ...children,
      ])
    }
    if (this.rootLocation) {
      this.locations = await this.$store.dispatch('locations/findChildren', this.rootLocation)
    } else {
      this.locations = Object.entries(this.locationHierarchy).flatMap(([locationId, children]) => [
        this.locationAll[locationId],
        ...children,
      ])
    }

    // criteria
    await this.searchReset()

    // build map
    try {
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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  },
  methods: {
    async reload() {
      this.fiches = []
      this.loading = true

      try {
        // search form
        await this.searchReset()
        this.isSearchVisible = false

        const ficheResult = await this.$store.dispatch('fiches/fetchByCategoryIds', {
          category: this.defaultCategory,
          location: this.defaultLocation,
          search: this.defaultSearch,
          criteria: this.defaultCriteria,
          per_page: PER_PAGE_NUMBER,
        })

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
      } finally {
        this.loading = false
      }
    },

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

        let categoryId = null
        if (this.formSearch.category) {
          categoryId = this.formSearch.category.id
        } else if (this.rootCategory) {
          categoryId = this.rootCategory.id
        }

        const criteriaList = categoryId
          ? await this.$wpAPI.criteria.getForCategory(categoryId).then(({ data }) => data)
          : []

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
      this.formSearch.category = null
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
      if (this.rootCategory) {
        this.formSearch.category =
          this.defaultCategory === this.rootCategory.slug
            ? null
            : this.categories.find(({ slug }) => slug === this.defaultCategory)
      } else {
        this.formSearch.category = this.defaultCategory
          ? this.categories.find(({ slug }) => slug === this.defaultCategory)
          : null
      }
      if (this.rootLocation) {
        this.formSearch.location =
          this.defaultLocation === this.rootLocation.slug
            ? null
            : this.locations.find(({ slug }) => slug === this.defaultLocation)
      } else {
        this.formSearch.location = this.defaultLocation
          ? this.locations.find(({ slug }) => slug === this.defaultLocation)
          : null
      }
      this.formSearch.search = this.defaultSearch

      // criteria
      await this.loadCriteria()
      this.formSearch.criteria.forEach((criteria) => {
        const initCriteria = this.defaultCriteria.find(({ taxonomy }) => taxonomy === criteria.taxonomy)
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
      if (this.formSearch.category) {
        query.category = this.formSearch.category.slug
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
      if (this.loading) {
        // eslint-disable-next-line no-console
        console.warn('loading first fiches')
        return
      }

      if (this.fichesLoading) {
        // eslint-disable-next-line no-console
        console.warn('already loading more fiches')
        return
      }

      if (!this.hasMoreFiches) {
        // eslint-disable-next-line no-console
        console.warn('no more pages')
        return
      }

      this.fichesLoading = true
      try {
        const ficheResult = await this.$store.dispatch('fiches/fetchByCategoryIds', {
          category: this.defaultCategory,
          location: this.defaultLocation,
          search: this.defaultSearch,
          criteria: this.defaultCriteria,
          page: this.fichesNextPage++,
          per_page: PER_PAGE_NUMBER,
        })

        this.fiches.push(...ficheResult.fiches)
        this.loadFichesOnMap(ficheResult.fiches)
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
          // eslint-disable-next-line no-console
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
              // goto fiche
              $('.fiche.selected').removeClass('selected')
              const ficheComponent = this.$refs[`fiche-${fiche.id}`][0]
              if (ficheComponent) {
                $(ficheComponent.$el).addClass('selected')
              }
              this.$scrollTo(ficheComponent.$el)
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
.search {
  margin: 2rem 0;
}

.search-button {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: $zindex-dropdown;
}

.map {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: $zindex-fixed + 1;
  height: calc(100% - #{$header-height} - #{$covid-banner-height});
}

.map-load-more {
  position: absolute;
  bottom: 0;
  left: 0;
}

.fiche.selected {
  @include media-breakpoint-up(md) {
    box-shadow: $box-shadow !important;
  }
}
</style>
