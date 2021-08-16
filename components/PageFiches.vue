<template>
  <div class="position-relative" style="min-height: 75vh">
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
                <div v-if="categories.length" class="form-group mb-0 mb-md-3">
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

      <main id="category-main" class="container">
        <div class="d-flex flex-wrap justify-content-around">
          <template v-if="!!fiches.length">
            <Fiche
              v-for="(fiche, i) in fiches"
              :key="fiche.id"
              :ref="`fiche-${fiche.id}`"
              v-observe-visibility="i === fiches.length - 1 ? lazyLoadFiches : false"
              :fiche="fiche"
              class="fiche m-3"
            >
              <template #front-footer>
                <a
                  href=""
                  title="Voir sur la carte"
                  class="btn btn-sm btn-outline-secondary"
                  @click.prevent="selectFicheOnMap(fiche)"
                >
                  <span class="mx-1"><i class="fas fa-map-marker-alt"></i></span>
                </a>
              </template>
            </Fiche>
          </template>
          <template v-if="$fetchState.pending">
            <FichePlaceholder v-for="f in 4" :key="f" class="fiche m-3" />
          </template>
          <template v-else-if="$fetchState.error">
            <span class="h5">{{ parseGQLError($fetchState.error) }} </span>
          </template>
          <template v-else-if="!fichesTotal">
            <span class="h5">
              Pas de résultat pour ta recherche <i class="far fa-surprise"></i>. Essaie de changer tes filtres.
            </span>
          </template>
        </div>
      </main>
    </div>

    <client-only>
      <FichesMap
        ref="map"
        :fiches="fiches"
        :count-next-fiches="countNextFiches"
        :loading="$fetchState.pending"
        :class="{ 'd-none': mapState != $mapState.SHOWN }"
        @fichesMapSelection="selectFiche"
        @fetchMofetchMoreFiches="$fetch"
      />
    </client-only>

    <b-button-group size="sm" class="toggle-content-btn">
      <b-button
        variant="primary"
        :pressed="mapState != $mapState.SHOWN"
        :disabled="$fetchState.pending"
        @click="mapState = $mapState.HIDDEN"
      >
        <span class="mr-1"><i class="far fa-file-alt"></i></span> Fiches
      </b-button>
      <b-button
        variant="primary"
        :pressed="mapState === $mapState.SHOWN"
        :disabled="$fetchState.pending || !fiches.length"
        @click="showMap"
      >
        <span class="mr-1"><i class="fas fa-map-marked-alt"></i></span> Carte
      </b-button>
    </b-button-group>

    <ScrollTop v-show="mapState != $mapState.SHOWN" />
  </div>
</template>

<script>
import { directive as SwiperDirective } from 'vue-awesome-swiper'
import { mapState } from 'vuex'
import _ from 'lodash'
import Vue from 'vue'
import $ from 'jquery'
import gql from 'graphql-tag'

import Fiche from '~/components/Fiche'
import { PER_PAGE_NUMBER } from '~/constants/default'
import CriteriaBadge from '~/components/CriteriaBadge'
import ScrollTop from '~/components/ScrollTop'
import FichePlaceholder from '~/components/FichePlaceholder'
import FichesMap from '~/components/FichesMap'
import { fiche as FicheFragments } from '~/apollo/fragments/fiche'
import graphql from '~/mixins/graphql'

const MapStates = Object.freeze({
  HIDDEN: Symbol('hidden'),
  SHOWN: Symbol('shown'),
  UPDATED: Symbol('updated'),
})
Vue.prototype.$mapState = MapStates

export default {
  components: { FichesMap, CriteriaBadge, Fiche, ScrollTop, FichePlaceholder },
  directives: { swiper: SwiperDirective },
  mixins: [graphql],
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
    try {
      const { data } = await this.$apollo.query({
        query: gql`
          query(
            $slug: String
            $location: String
            $search: String
            $criteria: [CriteriaSearch!]
            $page: Int!
            $pageSize: Int!
          ) {
            fichesByFilters(
              slug: $slug
              location: $location
              search: $search
              criteria: $criteria
              page: $page
              pageSize: $pageSize
            ) {
              hasMore
              total
              totalPages
              fiches {
                ...FicheFragments
              }
            }
          }
          ${FicheFragments}
        `,
        variables: {
          slug: this.defaultCategory,
          location: this.defaultLocation,
          search: this.defaultSearch,
          criteria: this.defaultCriteria,
          page: this.fichesNextPage++,
          pageSize: PER_PAGE_NUMBER,
        },
      })

      const { fiches, total, totalPages, hasMore } = data.fichesByFilters
      this.fiches.push(...fiches)
      this.fichesTotal = total
      this.fichesPages = totalPages
      this.hasMoreFiches = hasMore
      this.$refs.map.loadFichesOnMap()
    } catch (e) {
      this.$sentry.captureException(e)
      this.$nuxt.error({ statusCode: 500, message: this.parseGQLError(e) })
    } finally {
      if (this.mapState === MapStates.SHOWN) {
        this.resetMap()
      } else {
        this.mapState = MapStates.UPDATED
      }
    }
  },
  fetchOnServer: false,
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
      hasMoreFiches: false,

      // search form
      isSearchVisible: false,
      formSearch: { category: null, location: null, search: null, criteria: [] },

      mapState: MapStates.HIDDEN,

      criteriaLoading: false,
    }
  },
  validations() {
    return {
      formSearch: {},
    }
  },
  computed: {
    ...mapState({
      locationAll: (state) => state.locations.all,
      locationHierarchy: (state) => state.locations.hierarchy,
      categoryAll: (state) => state.categories.all,
      categoryHierarchy: (state) => state.categories.hierarchy,
      categoryMenu: (state) => state.menus.headerCategories,
    }),
    title() {
      return this.rootCategory ? this.rootCategory.name : this.rootLocation.name
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
  async created() {
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
        this.locationAll.find(({ id }) => id === locationId),
        ...children,
      ])
    }

    // criteria
    await this.searchReset()
  },
  methods: {
    async reload() {
      this.fiches = []
      this.fichesNextPage = 1

      // search form
      await this.searchReset()
      this.isSearchVisible = false
      await this.$fetch()
    },

    // criteria
    async loadCriteria() {
      // clear and exit if no category (e.g location page)
      if (!this.formSearch.category && !this.rootCategory) {
        this.formSearch.criteria = []
        return
      }

      try {
        this.criteriaLoading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query($id: Int!) {
              criteriaByCategory(id: $id) {
                id
                name
                taxonomy
                values {
                  id
                  slug
                  name
                  description
                }
              }
            }
          `,
          variables: {
            id: this.formSearch.category ? parseInt(this.formSearch.category.id) : parseInt(this.rootCategory.id),
          },
        })

        // build selectedValues "add-on"
        data.criteriaByCategory.forEach((criteria) => {
          criteria.selectedValues = []
          // try to map with default criteria
          const matchingDefaultCriteria = this.defaultCriteria.find(({ taxonomy }) => taxonomy === criteria.taxonomy)
          if (matchingDefaultCriteria) {
            const matchingCriteria = criteria.values.filter(({ slug }) => matchingDefaultCriteria.values.includes(slug))
            criteria.selectedValues.push(...matchingCriteria)
          }
        })
        this.formSearch.criteria = data.criteriaByCategory
      } catch (e) {
        this.$sentry.captureException(e)
        this.handleGQLError(e, 'Impossible de charger les critères :')
      } finally {
        this.criteriaLoading = false
      }
    },
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

    // map
    showMap() {
      if (this.mapState === MapStates.UPDATED) {
        this.resetMap()
      }
      this.mapState = MapStates.SHOWN
    },
    resetMap() {
      // wait untail map is shown
      this.$nextTick(() => {
        this.$refs.map.resetMap()
      })
    },
    selectFiche(id) {
      this.mapState = MapStates.HIDDEN
      // goto fiche
      $('.fiche.selected').removeClass('selected')
      const ficheComponent = this.$refs[`fiche-${id}`][0]
      if (ficheComponent) {
        $(ficheComponent.$el).addClass('selected')
      }
      this.$scrollTo(ficheComponent.$el)
    },
    selectFicheOnMap(fiche) {
      this.mapState = MapStates.SHOWN
      this.$nextTick(() => {
        this.$refs.map.gotoMarker(fiche)
      })
    },

    // fiches
    async lazyLoadFiches(isVisible) {
      if (isVisible) {
        if (this.hasMoreFiches && !this.$fetchState.pending) {
          await this.$fetch()
        }
      }
    },
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
  //z-index: $zindex-dropdown;
}

.fiche.selected {
  @include media-breakpoint-up(md) {
    //box-shadow: $box-shadow !important;
  }
}
</style>
