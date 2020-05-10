<template>
  <div v-if="category" class="category-page layout-content">
    <div class="position-relative">
      <div class="fiches py-4">
        <div class="container">
          <div class="text-center">
            <h1 class="mb-0">{{ category.name }}</h1>
            <span class="d-none d-md-inline muted">{{ fichesTotal }} résultats ({{ fiches.length }} affichés)</span>
          </div>
          <div class="search border rounded">
            <button v-b-toggle.search class="search-button h3 btn btn-light-grey">
              <span class="mr-2">Ma recherche</span>
              <i v-if="isSearchVisible" class="fas fa-minus"></i>
              <i v-else class="fas fa-plus"></i>
            </button>
            <b-collapse id="search" v-model="isSearchVisible">
              <div class="px-3 pt-5 pb-2">
                <form>
                  <div class="form-group">
                    <select v-model="formSearch.subCategory" class="form-control form-control-sm">
                      <option :value="null">Que cherches-tu ?</option>
                      <option v-for="category in subCategories" :key="category.id" :value="category">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <select v-model="formSearch.location" class="form-control form-control-sm">
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
                    <div v-for="criteria in criteriaList" :key="criteria.id" class="form-group">
                      <select v-model="criteria.selectedValues" class="form-control form-control-sm" multiple>
                        <option v-for="value in criteria.values" :key="`${criteria.id}-${value.id}`" :value="value">
                          {{ value.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="d-none d-md-block">
                    <fieldset v-for="criteria in criteriaList" :key="criteria.id" class="border my-3 px-3">
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
                  </div>
                  <div class="form-group">
                    <input
                      class="form-control form-control-sm"
                      type="text"
                      placeholder="En quelques mots ..."
                      name="search"
                    />
                  </div>
                </form>
              </div>
            </b-collapse>
            <div v-if="!isSearchVisible" :class="{ 'p-2 pt-3': hasSearchCriteria }">
              <template v-for="criteria in criteriaList">
                <a
                  v-for="value in criteria.selectedValues"
                  :key="value.id"
                  href=""
                  class="badge badge-pill badge-light-grey text-decoration-none mr-1"
                  @click.prevent="toggleValue(criteria, value)"
                >
                  <i class="far fa-times-circle"></i> {{ value.name }}
                </a>
              </template>
            </div>
          </div>
        </div>

        <b-overlay :show="loading" opacity="0.6" blur="none" spinner-variant="yellow">
          <div class="px-3">
            <div v-swiper="swiperOptions" class="swiper px-md-5">
              <div class="swiper-wrapper pt-3">
                <div
                  v-for="fiche in fiches"
                  :key="fiche.id"
                  class="swiper-slide align-self-start"
                  :data-hash="fiche.id"
                >
                  <Fiche ref="fiche" :fiche="fiche" :responsive="false" />
                </div>
              </div>
              <div v-if="!!fiches.length" slot="pagination" class="swiper-pagination" />
              <div v-if="!!fiches.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
              <div v-if="!!fiches.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
            </div>
          </div>
        </b-overlay>
      </div>

      <div class="map" :class="{ 'd-none': !isMapShown }">
        <div ref="map" class="h-100 w-100" />
        <button
          v-if="hasMoreFiche"
          class="map-load-more google-map-control bg-yellow w-auto"
          :disabled="loading || !hasMoreFiche"
          title="Afficher plus de fiches"
          @click="loadMoreFiches"
        >
          <b-overlay spinner-variant="grey" spinner-small :show="loading">
            <strong>+{{ countNextFiches }}</strong>
            <sub>Fiches</sub>
          </b-overlay>
        </button>
      </div>

      <div class="fiches-map-toggle-buttons btn-group btn-group-toggle" data-toggle="buttons">
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
import { CLUSTER_STYLES, MAP_OPTIONS, Z_INDEXES, ZOOM_LEVELS } from '~/constants/mapSettings'
import FicheInfoWindow from '~/components/FicheInfoWindow'
import { DEFAULT, RESPONSIVE } from '~/constants/swiper'

// create classes from components to use it in code
const FicheInfoWindowClass = Vue.extend(FicheInfoWindow)

export default {
  components: { Fiche },
  directives: { swiper: SwiperDirective },
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
      subCategories,
      categoryIds,
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
      isMapShown: false,

      // search
      isSearchVisible: false,
      criteriaList: [],
      formSearch: { subCategory: null, location: null, text: null },

      loading: true,
      swiperOptions: {
        ...DEFAULT,
        ...RESPONSIVE,
        on: {
          reachEnd: () => this.loadMoreFiches()
        }
      }
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
    },
    hasSingleFiche() {
      return this.fiches && this.fiches.length === 1
    },
    ...mapState('locations', {
      locations: 'hierarchy'
    }),
    flatLocations() {
      // first level only
      return this.locations.reduce(
        (locations, { location, subLocations }) => [...locations, location, ...subLocations],
        []
      )
    },
    hasSearchCriteria() {
      const hasSearch = Object.values(this.formSearch).find(Boolean)
      const hasCriteria = this.criteriaList.find(({ selectedValues }) => _.isEmpty(selectedValues) === false)
      return hasSearch || hasCriteria
    }
  },
  created() {
    this.$store.dispatch('menus/setSelectedCategory', this.category)
    this.loadCriteria(this.category)
  },
  async mounted() {
    // build map
    try {
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

      this.loadFiches(this.fiches)
    } catch (err) {
      if (err instanceof Error) console.error(err)
      else throw err
    } finally {
      this.loading = false
    }
  },
  methods: {
    toggleValue(criteria, value) {
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
    async loadCriteria(category) {
      const criteriaList = await this.$wpAPI.criteria.getForCategory(category.id).then(({ data }) => data)
      criteriaList.forEach((criteria) => (criteria.selectedValues = []))
      this.criteriaList = criteriaList
    },
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

          const ficheElmt = this.$refs[`fiche-${fiche.id}`][0]
          this.$scrollTo(ficheElmt.$el, 600, {
            offset: -160
          })
          $(ficheElmt.$el).addClass('selected')
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
::v-deep .fiche.selected {
  article {
    box-shadow: $box-shadow;
  }
}

.search {
  margin: 2rem 0;
}

.search-button {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
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
    position: absolute;
    top: 15px;
    bottom: auto;
    left: 15px;
    transform: none;

    width: 150px;
  }
}
</style>
