<template>
  <div>
    <v-dialog v-model="mapDialog" fullscreen hide-overlay transition="dialog-top-transition">
      <FichesMap
        :fiches="fiches"
        :selected-fiche="selectedFiche"
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
          <v-divider class="mx-auto grey" style="width: 40px; border: 2px solid; border-radius: 5px"></v-divider>
          <div class="align-center mt-2 grey--text text--darken-3 d-flex">
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
            <v-btn style="opacity: 0.9" dark rounded small @click="mapDialog = false">
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
          Filtrer
          <v-spacer></v-spacer>
          <v-btn icon @click="filtersDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-2 pb-0">
          <v-list>
            <v-subheader class="text-h6 black--text">Adresse Chouquettisée</v-subheader>
            <v-list-item three-line>
              <v-list-item-content class="pt-0">
                <div class="d-inline-flex align-center mt-1">
                  <p class="body-2 secondary--text text--lighten-2 ma-0">
                    Sélectionner que les adresses testées et approuvées par l'équipe. tesa fadsf
                    kldasjféladsjféalsdfkjasdélf jasdf
                  </p>
                  <v-switch v-model="chouquettiseOnly" color="primary ml-auto" inset :ripple="false"></v-switch>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <template v-if="criteriaFilters.length">
            <div v-for="criteriaFilter in criteriaFilters" :key="criteriaFilter.id">
              <FilterExpansion
                ref="criteriaFilters"
                :title="criteriaFilter.name"
                :items="criteriaFilter.values"
                :initialize="criteriaFilter.selectedIndexes"
                @update="(indexes) => updateCriteria(criteriaFilter, indexes)"
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
          <v-btn dark class="flex-grow-1 mx-1" @click.prevent="searchByFilters">Appliquer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      ref="ficheDialog"
      v-model="ficheDialog"
      color="white"
      fullscreen
      scrollable
      transition="slide-x-reverse-transition"
    >
      <v-card tile>
        <v-card-title>
          <FicheShare :fiche="selectedFiche" small outlined color="white--text grey darken-3">Partager</FicheShare>
          <v-spacer></v-spacer>
          <v-btn icon @click="clearFicheSelection">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-2 pb-0">
          <Fiche v-if="selectedFiche" :fiche="selectedFiche"></Fiche>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-container>
      <h1 class="text-h5 text-center mt-3">{{ location ? location.name : 'Toutes les adresses' }}</h1>
      <div id="categoryContainer" class="cq-scroll-x-container mt-4">
        <div class="d-inline-flex">
          <CategoryButton
            v-for="topCategory in topCategories"
            :id="topCategory.slug"
            :key="topCategory.id"
            :top-category="topCategory"
            :selected="topCategory === selectedTopCategory"
            :disabled="$fetchState.pending"
            @topCategorySelected="selectTopCategory(topCategory)"
          ></CategoryButton>
        </div>
      </div>
      <div v-if="subCategories.length" class="cq-scroll-x-container mt-1">
        <div class="d-inline-flex">
          <v-chip
            v-for="subCategory in subCategories"
            :key="subCategory.id"
            :dark="subCategory === selectedSubCategory"
            :class="{ 'grey lighten-4': subCategory !== selectedSubCategory }"
            :disabled="$fetchState.pending"
            class="mr-2"
            label
            @click.prevent="selectSubCategory(subCategory)"
            >{{ subCategory.name }}</v-chip
          >
        </div>
      </div>
      <div class="mt-1 d-inline-flex align-stretch">
        <v-text-field
          v-model="search"
          outlined
          label="Rechercher dans la categorie"
          prepend-inner-icon="mdi-magnify"
          color="grey darken-3"
          class="mr-2"
          clearable
          hide-details
          dense
          @change="searchByText"
          @click:clear.capture="clearSearch"
        ></v-text-field>
        <v-badge bordered color="secondary" :content="filterCount" :value="filterCount" overlap>
          <v-btn outlined height="100%" @click="filtersDialog = true">
            <v-icon left>mdi-tune</v-icon>
            Filtrer
          </v-btn>
        </v-badge>
      </div>
      <template v-if="fiches.length">
        <v-subheader class="px-0 text-body-2">{{ fichesTotal }} résultats</v-subheader>
        <v-card
          v-for="fiche in fiches"
          :key="fiche.id"
          class="mb-3"
          :loading="selectedFicheCard === fiche"
          outlined
          bench="2"
          active-class=" "
          @click="selectFiche(fiche)"
        >
          <WpMediaNew :media="fiche.image" size="medium_large" height="200" contains>
            <v-card-subtitle v-if="fiche.isChouquettise">
              <v-chip color="primary" text-color="black" small>
                Testé et Chouquettisé
                <v-icon right>mdi-check</v-icon>
              </v-chip>
            </v-card-subtitle>
          </WpMediaNew>
          <v-card-title class="text-h5 d-block text-break">{{ fiche.title }}</v-card-title>
          <v-card-subtitle class="text-uppercase">{{
            getCategoryById(fiche.principalCategoryId).name
          }}</v-card-subtitle>
          <v-card-text class="black--text">
            <div class="fiche-content" v-html="fiche.content"></div>
            <a href="" @click.prevent="">Voir Plus</a>
            <v-chip-group v-if="fiche.criteria" class="mt-3" column>
              <v-chip
                v-for="criteriaValue in sampleCriteriaValues(fiche)"
                :key="criteriaValue.id"
                color="primary lighten-4"
                text-color="grey darken-3"
                label
                small
              >
                {{ criteriaValue.name }}</v-chip
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
        color="secondary lighten-3"
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
          dark
          rounded
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
import { mapGetters, mapState } from 'vuex'
import gql from 'graphql-tag'
import seo from '~/mixins/seo'
import { fiche as FicheFragments } from '~/apollo/fragments/fiche'
import { PER_PAGE_NUMBER } from '~/constants/default'
import WpMediaNew from '~/components/WpMediaNew'
import graphql from '~/mixins/graphql'
import FilterExpansion from '~/components/FilterExpansion'
import ScrollTop from '~/components/ScrollTop'
import FichesMap from '~/components/FichesMap'
import Fiche from '~/components/Fiche'
import { postCard as PostCardFragments } from '~/apollo/fragments/postCard'
import { ficheCard as FicheCardFragments } from '~/apollo/fragments/ficheCard'
import FicheShare from '~/components/FicheShare'
import CategoryButton from '~/components/CategoryButton'

const MapStates = Object.freeze({
  HIDDEN: Symbol('hidden'),
  SHOWN: Symbol('shown'),
  UPDATED: Symbol('updated'),
})

export default {
  components: { CategoryButton, FicheShare, Fiche, FilterExpansion, WpMediaNew, ScrollTop, FichesMap },
  mixins: [seo, graphql],
  asyncData({ store, params, query }) {
    const location = params.slug ? store.getters['locations/getBySlug'](params.slug) : null

    const category = query.category ? store.getters['categories/getBySlug'](query.category) : null

    const criteriaList = Object.entries(query)
      .filter(([key]) => key.startsWith('cq_'))
      .map(([key, value]) => {
        return { taxonomy: key, values: value.split(',') }
      })

    return {
      location,
      category,
      search: query.search,
      chouquettiseOnly: Boolean(query.chouquettiseOnly),
      criteriaList,
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
      selectedFiche: null,
      ficheDialog: false,

      subCategories: [],

      selectedTopCategory: null,
      selectedSubCategory: null,

      filterCount: 0,
      filtersDialog: false,
      criteriaFilters: [],
      criteriaLoading: false,

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
            $criteria: [CriteriaSearch!]
            $page: Int!
            $pageSize: Int!
          ) {
            fichesByFilters(
              category: $category
              location: $location
              search: $search
              chouquettiseOnly: $chouquettiseOnly
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
          category: this.category ? this.category.slug : null,
          location: this.location ? this.location.slug : null,
          search: this.search,
          chouquettiseOnly: this.chouquettiseOnly,
          criteria: this.criteriaList,
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
      await this.fetchCriteria(this.category)

      // move to selected category using jquery
      /* eslint-disable no-undef */
      const leftOffset = $(`#${this.selectedTopCategory.slug}`).position().left
      $('#categoryContainer').animate({ scrollLeft: leftOffset - 15 }, 250)
      /* eslint-enable no-undef */
    }
  },
  created() {
    // watch for filter changes
    this.$watch(
      (vm) => [vm.chouquettiseOnly, vm.criteriaList],
      () => {
        this.filterCount = this.criteriaList.reduce((acc, criteria) => (acc += criteria.values.length), 0)
        if (this.chouquettiseOnly) this.filterCount++
      },
      {
        immediate: true,
        deep: true,
      }
    )
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
    updateCriteria(criteriaFilter, selectedCriteria) {
      const values = selectedCriteria.map(({ slug }) => slug)
      const criteria = this.criteriaList.find(({ taxonomy }) => criteriaFilter.taxonomy)
      if (criteria) {
        if (values) criteria.values = values
        else this.criteriaList = this.criteriaList.filter(({ taxonomy }) => criteria.taxonomy)
      } else if (values) {
        this.criteriaList.push({ taxonomy: criteriaFilter.taxonomy, values })
      }
    },
    fetchWithFilters() {
      this.fichesNextPage = 1
      this.fiches = []

      const query = this.criteriaList.reduce((acc, { taxonomy, values }) => {
        acc[taxonomy] = values.join(',')
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

      return Promise.all([this.fetchWithFilters(), this.fetchCriteria(this.category)])
    },
    selectSubCategory(category) {
      this.category = category
      this.selectedSubCategory = this.category

      return Promise.all([this.fetchWithFilters(), this.fetchCriteria(this.category)])
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
      this.$refs.criteriaFilters.forEach((comp) => comp.clear())
    },
    sampleCriteriaValues(fiche) {
      return fiche.criteria.flatMap(({ values }) => values).slice(0, 3)
    },
    async fetchCriteria(category) {
      try {
        this.criteriaLoading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query ($id: Int!) {
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
            id: parseInt(category.id),
          },
        })

        // build selected indexes based on criteria list
        data.criteriaByCategory.forEach((criteria) => {
          criteria.selectedIndexes = []
          // try to map with default criteria
          const currentCriteria = this.criteriaList.find(({ taxonomy }) => taxonomy === criteria.taxonomy)
          if (currentCriteria) {
            criteria.selectedIndexes = currentCriteria.values.reduce((acc, currentSlug) => {
              const index = criteria.values.findIndex(({ slug }) => slug === currentSlug)
              if (index !== -1) acc.push(index)
              return acc
            }, [])
          }
        })
        this.criteriaFilters = data.criteriaByCategory
      } catch (e) {
        this.$sentry.captureException(e)
        this.handleGQLError(e, 'Impossible de charger les critères :')
      } finally {
        this.criteriaLoading = false
      }
    },
    async selectFiche(ficheCard) {
      this.selectedFicheCard = ficheCard
      this.selectedFiche = await this.$apollo
        .query({
          query: gql`
            query ($slug: String!) {
              ficheBySlug(slug: $slug) {
                ...FicheFragments

                postCards {
                  ...PostCardFragments
                }

                similarFiches {
                  ...FicheCardFragments
                }
              }
            }
            ${FicheFragments}
            ${PostCardFragments}
            ${FicheCardFragments}
          `,
          variables: { slug: ficheCard.slug },
        })
        .then(({ data }) => data.ficheBySlug)
      this.ficheDialog = true
    },
    clearFicheSelection() {
      this.selectedFicheCard = null
      this.ficheDialog = false
    },
  },
  computed: {
    ...mapState(['wordpressUrl']),
    ...mapState('categories', { topCategories: 'topLevels' }),
    ...mapState('locations', { locations: 'flatSorted' }),
    ...mapGetters('categories', {
      getCategoryById: 'getById',
      getCategoriesByParentId: 'getChildrenForId',
    }),
    ficheCountWithPoi() {
      return this.fiches.filter(({ poi }) => !!poi).length
    },
  },
  head() {
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
        { property: 'og:url', content: this.currentURL },
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
            logo: `${this.wordpressUrl}/logo.png`,
          },
          url: this.currentURL,
        }),
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.top-category-btn {
  width: 200px;
  border: 1px solid grey;

  &:disabled,
  &button[disabled] {
    opacity: 0.6;
  }
}

.fiche-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>