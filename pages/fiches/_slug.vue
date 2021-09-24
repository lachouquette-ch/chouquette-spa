<template>
  <div>
    <v-dialog v-model="mapDialog" fullscreen hide-overlay transition="dialog-top-transition">
      <FichesMap
        :fiches="fiches"
        :selected-fiche="selectedFicheCard"
        :has-more-fiches="hasMoreFiches"
        :fiche-loading="!!selectedFicheCard"
        :fetch-loading="$fetchState.pending"
        @mapSelectFiche="selectFiche"
        @moreFiches="$fetch"
      ></FichesMap>
      <v-container
        ref="mapFooter"
        v-hammer:pan.vertical="mapOnPanVertical"
        v-hammer:panend="mapOnPanEnd"
        class="white rounded-t-xl pa-0"
        fluid
        style="position: absolute; bottom: 0"
        :style="`height: ${mapFooterHeight}`"
      >
        <div class="pa-3">
          <v-divider
            class="mx-auto cq-grey-light"
            style="width: 40px; border: 2px solid; border-radius: 5px"
          ></v-divider>
          <div class="align-center mt-2 d-flex">
            <span>{{ ficheCountWithPoi }} adresses affichées</span>&nbsp;
            <v-tooltip max-width="90vw" top>
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" small v-on="on">mdi-help-circle-outline</v-icon>
              </template>
              <span class="text-wrap"
                >Seules les adresses physiques sont affichées. Retourne sur la 'Liste' pour voir toutes les adresses ou
                clique sur 'Plus de fiches' pour en voir d'avantage</span
              >
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-btn style="opacity: 0.9" color="cq-grey" class="white--text" rounded small @click="mapDialog = false">
              <v-icon left>mdi-format-list-text</v-icon>
              Liste
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-dialog>

    <v-dialog v-model="filtersDialog" fullscreen scrollable transition="dialog-bottom-transition">
      <v-card tile>
        <v-card-title>
          <span><h3>Filtrer</h3></span>
          <v-spacer></v-spacer>
          <v-btn icon @click="filtersDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-2 pb-0">
          <v-list>
            <v-subheader><h3>Adresse Chouquettisée</h3></v-subheader>
            <v-list-item three-line>
              <v-list-item-content class="pt-0">
                <div class="d-inline-flex align-center">
                  <p class="ma-0 text-caption">
                    Sélectionner que les adresses testées et approuvées par l'équipe. tesa fadsf
                    kldasjféladsjféalsdfkjasdélf jasdf
                  </p>
                  <v-switch
                    v-model="chouquettiseOnly"
                    color="cq-yellow"
                    inset
                    :ripple="false"
                    @change="updateFilterCounter"
                  ></v-switch>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <template v-if="categoryFilters.length">
            <div v-for="categoryFilter in categoryFilters" :key="categoryFilter.id">
              <FilterExpansion
                ref="categoryFilter"
                v-model="categoryFilter.selectedSlugs"
                :title="categoryFilter.name"
                :items="categoryFilter.values"
                @updateCount="updateFilterCounter"
              ></FilterExpansion>
            </div>
          </template>
          <v-alert
            v-else
            border="left"
            color="primary lighten-3"
            class="mt-3 mb-0 text-center"
            elevation="1"
            colored-border
          >
            Selectionner une catégorie pour obtenir plus de filtres
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn outlined class="flex-grow-2 mx-1" @click.prevent="clearCriteria">Tout effacer</v-btn>
          <v-btn color="primary" class="flex-grow-1 mx-1" @click.prevent="searchByFilters">Appliquer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <FicheDialog v-model="selectedFicheCard" @close="selectedFicheCard = null"></FicheDialog>

    <v-container>
      <h1 class="text-center mt-3">{{ location ? location.name : 'Toutes les adresses' }}</h1>
      <div id="categoryContainer" class="cq-scroll-x-container mt-4 justify-start">
        <CategoryButton
          v-for="topCategory in topCategories"
          :id="topCategory.slug"
          :key="topCategory.id"
          :top-category="topCategory"
          :selected="topCategory === selectedTopCategory"
          :disabled="$fetchState.pending"
          @click="selectTopCategory(topCategory)"
        ></CategoryButton>
      </div>
      <div v-if="subCategories.length" class="cq-scroll-x-container mt-1">
        <div class="d-inline-flex">
          <v-chip
            v-for="subCategory in subCategories"
            :key="subCategory.id"
            :dark="subCategory === selectedSubCategory"
            :disabled="$fetchState.pending"
            class="mr-2"
            label
            @click.prevent="selectSubCategory(subCategory)"
            >{{ subCategory.name }}</v-chip
          >
        </div>
      </div>
      <div class="mt-1 d-flex align-stretch">
        <v-text-field
          v-model="search"
          outlined
          label="Rechercher dans la categorie"
          prepend-inner-icon="mdi-magnify"
          class="mr-2"
          clearable
          hide-details
          dense
          @change="searchByText"
          @click:clear.capture="clearSearch"
        ></v-text-field>
        <v-badge bordered color="primary" :content="filterCount" :value="filterCount" overlap>
          <v-btn outlined height="100%" @click="filtersDialog = true">
            <v-icon left>mdi-tune</v-icon>
            Filtrer
          </v-btn>
        </v-badge>
      </div>
      <template v-if="fiches.length">
        <v-subheader class="px-0">{{ fichesTotal }} résultats</v-subheader>
        <v-card
          v-for="fiche in fiches"
          :key="fiche.id"
          class="mb-3"
          outlined
          bench="2"
          active-class=" "
          :loading="selectedFicheCard === fiche ? 'white' : false"
          loader-height="5"
          @click="selectFiche(fiche)"
        >
          <WpMediaNew :media="fiche.image" size="medium_large" height="200" contains>
            <v-card-subtitle v-if="fiche.isChouquettise" class="pa-2">
              <v-chip color="cq-yellow" text-color="black" small>
                Testé et Chouquettisé
                <v-icon right>mdi-check</v-icon>
              </v-chip>
            </v-card-subtitle>
          </WpMediaNew>
          <v-card-title class="d-block">
            <h3>{{ fiche.title }}</h3>
            <v-card-subtitle class="pa-0 mt-1 secondary--text">
              <span v-if="!location && fiche.locationId">{{ getLocationById(fiche.locationId).name }} - </span>
              {{ getCategoryById(fiche.principalCategoryId).name }}
            </v-card-subtitle>
          </v-card-title>
          <v-card-text>
            <div class="fiche-content mb-1" v-html="fiche.content"></div>
            <a href="" @click.prevent="">Voir plus</a>
            <v-chip-group v-if="fiche.valueIds.length" class="mt-3" column>
              <v-chip
                v-for="valueId in fiche.valueIds"
                :key="valueId"
                color="cq-blue-light"
                text-color="cq-secondary"
                label
                small
              >
                {{ getValueById(valueId).name }}</v-chip
              >
            </v-chip-group>
          </v-card-text>
        </v-card>
        <v-btn
          v-if="!$fetchState.pending && hasMoreFiches"
          v-intersect.quiet="$fetch"
          color="secondary"
          :loading="$fetchState.pending"
          block
          tag="a"
          rel="next"
          outlined
          @click="$fetch"
        >
          Plus d'adresses
        </v-btn>
      </template>
      <div v-if="$fetchState.pending" class="mt-3">
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          class="mb-3"
          elevation="1"
          type="image, article, actions"
        ></v-skeleton-loader>
      </div>
      <v-alert
        v-else-if="!hasMoreFiches"
        border="bottom"
        color="secondary"
        class="mt-3 mb-0 text-center"
        elevation="2"
        colored-border
      >
        <span v-if="fiches.length">Tu as tout vu !</span>
        <span v-else>Aucun résultat pour ta recherche</span>
      </v-alert>

      <v-fade-transition>
        <v-btn
          v-if="!mapDialog"
          style="opacity: 0.9; bottom: 65px; left: 50%; transform: translateX(-50%)"
          color="cq-grey"
          class="white--text"
          small
          fixed
          @click="mapDialog = true"
        >
          <v-icon left>mdi-map</v-icon>
          Carte
        </v-btn>
      </v-fade-transition>
      <ScrollTop></ScrollTop>
    </v-container>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import gql from 'graphql-tag'
import seo from '~/mixins/seo'
import {PER_PAGE_NUMBER} from '~/constants/default'
import WpMediaNew from '~/components/WpMediaNew'
import graphql from '~/mixins/graphql'
import FilterExpansion from '~/components/FilterExpansion'
import ScrollTop from '~/components/ScrollTop'
import FichesMap from '~/components/FichesMap'
import {ficheCard as FicheCardFragments} from '~/apollo/fragments/ficheCard'
import CategoryButton from '~/components/CategoryButton'
import FicheDialog from '~/components/FicheDialog'

const MapStates = Object.freeze({
  HIDDEN: Symbol('hidden'),
  SHOWN: Symbol('shown'),
  UPDATED: Symbol('updated'),
})

export default {
  components: { FicheDialog, CategoryButton, FilterExpansion, WpMediaNew, ScrollTop, FichesMap },
  mixins: [seo, graphql],
  asyncData({ store, params, query }) {
    const location = params.slug ? store.getters['locations/getBySlug'](params.slug) : null
    const category = query.category ? store.getters['categories/getBySlug'](query.category) : null

    return {
      location,
      category,
      search: query.search,
      chouquettiseOnly: Boolean(query.chouquettiseOnly),
    }
  },
  data() {
    return {
      fichesNextPage: 1,
      fiches: [],
      fichesTotal: null,
      fichesPages: null,
      hasMoreFiches: true,
      selectedFicheCard: null,
      previousURL: null,

      subCategories: [],

      selectedTopCategory: null,
      selectedSubCategory: null,

      filterCount: 0,
      filtersDialog: false,
      categoryFilters: [],
      filtersLoading: false,

      mapDialog: false,
      mapFooterHeight: 64,
    }
  },
  async fetch() {
    if (!this.hasMoreFiches) {
      console.info('Plus de fiches disponibles')
      return
    }

    try {
      const { data } = await this.$apollo.query({
        query: gql`
          query (
            $category: String
            $location: String
            $search: String
            $chouquettiseOnly: Boolean
            $categoryFilters: [TaxonomyFilter!]
            $page: Int!
            $pageSize: Int!
          ) {
            fichesByFilters(
              category: $category
              location: $location
              search: $search
              chouquettiseOnly: $chouquettiseOnly
              categoryFilters: $categoryFilters
              page: $page
              pageSize: $pageSize
            ) {
              hasMore
              total
              totalPages
              fiches {
                ...FicheCardFragments
              }
            }
          }
          ${FicheCardFragments}
        `,
        variables: {
          category: this.category ? this.category.slug : null,
          location: this.location ? this.location.slug : null,
          search: this.search,
          chouquettiseOnly: this.chouquettiseOnly,
          categoryFilters: this.categoryFilters.map(({ taxonomy, selectedSlugs }) => {
            return { taxonomy, values: selectedSlugs }
          }),
          page: this.fichesNextPage++,
          pageSize: PER_PAGE_NUMBER,
        },
      })

      const { fiches, total, totalPages, hasMore } = data.fichesByFilters
      this.fiches.push(...fiches)
      this.fichesTotal = total
      this.fichesPages = totalPages
      this.hasMoreFiches = hasMore
      // this.$refs.map.loadFichesOnMap()
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
  async mounted() {
    // initialize categories
    if (this.category) {
      if (this.category.parentId) {
        this.selectedSubCategory = this.category
        this.selectedTopCategory = this.getCategoryById(this.category.parentId)
      } else {
        this.selectedTopCategory = this.category
      }
      this.subCategories = await this.getCategoriesByParentId(this.selectedTopCategory.id)
      await this.fetchCategoryFilters(this.category)

      // update categoryFilter
      Object.entries(this.$route.query)
        .filter(([key]) => key.startsWith('cq_'))
        .forEach(([key, value]) => {
          const categoryFilter = this.categoryFilters.find(({ taxonomy }) => taxonomy === key)
          if (categoryFilter) categoryFilter.selectedSlugs = value.split(',')
        })

      // move to selected category
      const categoryButton = document.getElementById(this.category.slug)
      const categoryContainer = document.getElementById('categoryContainer')
      const buttonLeftOffset = categoryButton.offsetLeft
      const maxLeftOffset = categoryContainer.scrollWidth - categoryContainer.clientWidth
      const leftOffset = buttonLeftOffset > maxLeftOffset ? maxLeftOffset : buttonLeftOffset
      categoryContainer.scrollLeft = leftOffset
    }
    this.updateFilterCounter()
  },
  methods: {
    mapOnPanEnd() {
      /* eslint-disable no-undef */
      if ($(this.$refs.mapFooter).height() > $(window).height() / 3) {
        this.mapDialog = false
      }
      $(this.$refs.mapFooter).height(this.mapFooterHeight)
      /* eslint-enable no-undef */
    },
    mapOnPanVertical(event) {
      /* eslint-disable no-undef */
      const height = this.mapFooterHeight - event.deltaY
      if (height > this.mapFooterHeight) {
        $(this.$refs.mapFooter).height(this.mapFooterHeight + height)
      }
      /* eslint-enable no-undef */
    },
    fetchWithFilters() {
      this.fichesNextPage = 1
      this.hasMoreFiches = true
      this.fiches = []

      const query = this.categoryFilters.reduce((acc, { taxonomy, selectedSlugs }) => {
        if (selectedSlugs.length) acc[taxonomy] = selectedSlugs.join(',')
        return acc
      }, {})
      if (this.category) query.category = this.category.slug
      if (this.search) query.search = this.search
      if (this.chouquettiseOnly) query.chouquettiseOnly = this.chouquettiseOnly

      this.$router.replace({ query })
      return this.$fetch()
    },
    async selectTopCategory(topCategory) {
      this.category = topCategory
      this.selectedTopCategory = this.category
      this.selectedSubCategory = null
      this.subCategories = await this.getCategoriesByParentId(this.category.id)

      await this.fetchCategoryFilters(this.category)
      return this.fetchWithFilters()
    },
    async selectSubCategory(category) {
      this.category = category
      this.selectedSubCategory = this.category

      await this.fetchCategoryFilters(this.category)
      return this.fetchWithFilters()
    },
    searchByText() {
      if (this.search != null) this.fetchWithFilters()
    },
    clearSearch() {
      this.search = null
      this.fetchWithFilters()
    },
    searchByFilters() {
      this.filtersDialog = false
      this.fetchWithFilters()
    },
    clearCriteria() {
      this.chouquettiseOnly = false
      if (this.$refs.categoryFilter) this.$refs.categoryFilter.forEach((f) => f.clear())
      this.updateFilterCounter()
    },
    sampleCriteriaValues(fiche) {
      return fiche.categoryFilters.flatMap(({ values }) => values).slice(0, 3)
    },
    async fetchCategoryFilters(category) {
      try {
        this.filtersLoading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query ($id: Int!) {
              filtersByCategory(id: $id) {
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
            id: parseInt(category.id),
          },
        })

        // try to map with previous filters
        data.filtersByCategory.forEach((categoryFilter) => {
          const previousFilter = this.categoryFilters.find(({ taxonomy }) => taxonomy === categoryFilter.taxonomy)
          if (previousFilter) categoryFilter.selectedSlugs = previousFilter.selectedSlugs
          else categoryFilter.selectedSlugs = []
        })
        this.categoryFilters = data.filtersByCategory
      } catch (e) {
        this.$sentry.captureException(e)
        this.handleGQLError(e, 'Impossible de charger les critères :')
      } finally {
        this.filtersLoading = false
      }
    },
    selectFiche(ficheCard) {
      this.selectedFicheCard = ficheCard
    },
    updateFilterCounter() {
      this.filterCount = this.categoryFilters.reduce((acc, filter) => (acc += filter.selectedSlugs.length), 0)
      if (this.chouquettiseOnly) this.filterCount++
    },
  },
  computed: {
    ...mapState('categories', { topCategories: 'topLevels' }),
    ...mapState('locations', { locations: 'flatSorted' }),
    ...mapGetters('categories', {
      getCategoryById: 'getById',
      getCategoriesByParentId: 'getChildrenForId',
    }),
    ...mapGetters('locations', {
      getLocationById: 'getById',
    }),
    ...mapGetters('values', {
      getValueById: 'getById',
    }),
    ficheCountWithPoi() {
      return this.fiches.filter(({ poi }) => !!poi).length
    },
  },
  head() {
    // TODO (Fiche) : finish migrating Fiche slug init. Need to remove fetching Fiche from any other component that Fiche or fiche/_slug
    const title = this.location ? this.location.name : 'Adresses'
    const content = this.location
      ? this.$options.filters.heDecode(this.location.description || this.location.name)
      : 'Toutes les adresses du site'

    return {
      title,
      meta: this.seoMetaProperties([
        {
          name: 'description',
          content,
        },

        { property: 'og:type', content: 'article' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:url', content: location.href },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content,
        },
        { property: 'og:image', content: '' },

        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: title },
        {
          name: 'twitter:description',
          content,
        },
        { name: 'twitter:image', content: '' },
      ]),
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: title,
          description: content,
          publisher: {
            '@type': 'Organization',
            name: 'La Chouquette',
            logo: `${this.$config.siteUrl}/logo.png`,
          },
          url: this.$config.siteUrl,
        }),
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.fiche-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
