<template>
  <div>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="mapDialog" fullscreen hide-overlay transition="dialog-top-transition">
      <FichesMap
        :fiches="fiches"
        :has-more-fiches="hasMoreFiches"
        :fiche-loading="loading"
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
            <v-btn
              style="opacity: 0.9"
              color="cq-grey"
              class="white--text"
              rounded
              :small="$vuetify.breakpoint.mobile"
              @click="mapDialog = false"
            >
              <v-icon left>mdi-format-list-text</v-icon>
              <span v-if="$vuetify.breakpoint.mobile">Liste</span>
              <span v-else>Retour à la liste</span>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-dialog>

    <v-dialog
      v-model="filtersDialog"
      :fullscreen="$vuetify.breakpoint.mobile"
      max-width="500"
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card min-height="500" tile>
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
                  <p class="mb-0 mr-3 text-caption">
                    Sélectionner que les adresses testées et approuvées par l'équipe. tesa fadsf
                    kldasjféladsjféalsdfkjasdélf jasdf
                  </p>
                  <v-spacer></v-spacer>
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
        <v-card-actions class="justify-end">
          <v-btn outlined class="flex-grow-2 flex-md-grow-0 mx-1" @click.prevent="clearCriteria">Tout effacer</v-btn>
          <v-btn color="primary" class="flex-grow-1 flex-md-grow-0 mx-1" @click.prevent="searchByFilters"
            >Appliquer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <FichePostDialog
      v-model="ficheDialog"
      :fiche-or-post="selectedFiche"
      :fullscreen="$vuetify.breakpoint.mobile"
      max-width="500"
      replace-url
    ></FichePostDialog>

    <v-container class="cq-md-max-width">
      <h1 class="text-center my-3">{{ location ? location.name : 'Toutes les adresses' }}</h1>
      <ReponsiveScrollGrid id="topCategoryContainer" :items="topCategories" mobile-only>
        <template #default="{ item }">
          <CategoryButton
            :id="item.slug"
            :top-category="item"
            :selected="item === selectedTopCategory"
            :disabled="$fetchState.pending"
            @click="selectTopCategory(item)"
          ></CategoryButton>
        </template>
      </ReponsiveScrollGrid>
      <ReponsiveScrollGrid
        v-if="subCategories.length"
        id="subCategoryContainer"
        :items="subCategories"
        mobile-only
        class="mt-2"
      >
        <template #default="{ item }">
          <v-chip
            :id="item.slug"
            :dark="item === selectedSubCategory"
            :disabled="$fetchState.pending"
            label
            @click.prevent="selectSubCategory(item)"
            >{{ item.name }}</v-chip
          >
        </template>
      </ReponsiveScrollGrid>
      <div class="mt-2 mt-sm-5 d-flex align-stretch">
        <template v-if="!$vuetify.breakpoint.mobile">
          <v-select
            v-model="selectedTopCategory"
            :items="topCategories"
            :disabled="$fetchState.pending"
            outlined
            dense
            hide-details
            item-text="name"
            item-value="slug"
            return-object
            label="Catégorie"
            class="flex-grow-0 mr-2"
            @change="selectTopCategory(selectedTopCategory)"
          ></v-select>
          <v-select
            v-if="selectedTopCategory && subCategories.length"
            v-model="selectedSubCategory"
            :disabled="$fetchState.pending"
            :items="subCategories"
            outlined
            dense
            hide-details
            item-text="name"
            item-value="slug"
            return-object
            label="Sous-catégorie"
            class="flex-grow-0 mr-2"
            @change="selectSubCategory(selectedSubCategory)"
          ></v-select>
        </template>
        <v-text-field
          v-model="search"
          outlined
          label="Rechercher dans la categorie"
          prepend-inner-icon="mdi-magnify"
          class="mr-2 ml-md-auto flex-sm-grow-0"
          :disabled="$fetchState.pending"
          style="width: 250px"
          clearable
          hide-details
          dense
          @change="searchByText"
          @click:clear.capture="clearSearch"
        ></v-text-field>
        <v-badge bordered color="primary" :content="filterCount" :value="filterCount" overlap>
          <v-btn outlined :disabled="$fetchState.pending" height="100%" @click="filtersDialog = true">
            <v-icon left>mdi-tune</v-icon>
            Filtrer
          </v-btn>
        </v-badge>
      </div>
      <v-subheader class="px-0"
        ><span v-if="fichesTotal && !$fetchState.pending">{{ fichesTotal }} résultats</span></v-subheader
      >
      <v-container class="pa-0">
        <v-row v-if="fiches.length">
          <v-col v-for="fiche in fiches" :key="fiche.id" cols="12" sm="4">
            <v-card outlined active-class="" height="100%" @click="selectFiche(fiche)">
              <WpMedia :media="fiche.image" size="medium_large" height="200" contains>
                <v-card-subtitle v-if="fiche.isChouquettise" class="pa-2">
                  <v-chip color="cq-yellow" text-color="black" small>
                    Testé et Chouquettisé
                    <v-icon right>mdi-check</v-icon>
                  </v-chip>
                </v-card-subtitle>
              </WpMedia>
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
          </v-col>
          <template v-if="$fetchState.pending">
            <v-col v-for="i in 4" :key="i" cols="12" sm="4">
              <v-skeleton-loader elevation="1" type="image, article, actions" class="rounded-xl"></v-skeleton-loader>
            </v-col>
          </template>
          <v-col cols="12" sm="4">
            <v-btn
              v-if="!$fetchState.pending && hasMoreFiches"
              v-intersect.quiet="$fetch"
              :loading="$fetchState.pending"
              block
              class="secondary white--text"
              height="100%"
              tag="a"
              rel="next"
              outlined
              @click="$fetch"
            >
              Plus d'adresses
            </v-btn>
          </v-col>
        </v-row>
        <v-alert
          v-else-if="!hasMoreFiches"
          border="bottom"
          color="primary"
          class="text-center"
          elevation="2"
          colored-border
        >
          <span v-if="fiches.length">Tu as tout vu !</span>
          <template v-else>
            <span>Aucun résultat pour ta recherche.</span>
            <a v-if="filterCount" href="" @click.prevent="filtersDialog = true">Tu peux changer tes filtres</a>
          </template>
        </v-alert>
      </v-container>
      <v-fade-transition>
        <v-btn
          v-if="!mapDialog"
          color="cq-grey"
          class="map-button white--text"
          :small="$vuetify.breakpoint.mobile"
          fixed
          @click="mapDialog = true"
        >
          <v-icon left>mdi-map</v-icon>
          <span v-if="$vuetify.breakpoint.mobile">Carte</span>
          <span v-else>Afficher la carte</span>
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
import ficheFiche from '~/mixins/fetch-wp'
import { PER_PAGE_NUMBER } from '~/constants/default'
import WpMedia from '~/components/Media'
import graphql from '~/mixins/graphql'
import FilterExpansion from '~/components/FilterExpansion'
import ScrollTop from '~/components/ScrollTop'
import FichesMap from '~/components/FichesMap'
import { ficheCard as FicheCardFragments } from '~/apollo/fragments/ficheCard'
import CategoryButton from '~/components/CategoryButton'
import FichePostDialog from '~/components/FichePostDialog'
import ReponsiveScrollGrid from '~/components/ReponsiveScrollGrid'

const MapStates = Object.freeze({
  HIDDEN: Symbol('hidden'),
  SHOWN: Symbol('shown'),
  UPDATED: Symbol('updated'),
})

export default {
  components: {
    ReponsiveScrollGrid,
    FichePostDialog,
    CategoryButton,
    FilterExpansion,
    WpMedia,
    ScrollTop,
    FichesMap,
  },
  mixins: [seo, graphql, ficheFiche],
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
      loading: false,

      fichesNextPage: 1,
      fiches: [],
      fichesTotal: null,
      fichesPages: null,
      hasMoreFiches: true,
      previousURL: null,

      subCategories: [],

      selectedTopCategory: null,
      selectedSubCategory: null,

      filterCount: 0,
      filtersDialog: false,
      categoryFilters: [],
      filtersLoading: false,

      selectedFiche: null,
      ficheDialog: false,

      mapDialog: false,
      mapFooterHeight: 64,
    }
  },
  async fetch() {
    if (!this.hasMoreFiches) {
      console.info('Plus de fiche à te proposer')
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

      // move to selected topCategory
      const topCategoryButton = document.getElementById(this.selectedTopCategory.slug)
      if (topCategoryButton) {
        const categoryContainer = document.getElementById('topCategoryContainer')
        const buttonLeftOffset = topCategoryButton.offsetLeft
        const maxLeftOffset = categoryContainer.scrollWidth - categoryContainer.clientWidth
        const leftOffset = buttonLeftOffset > maxLeftOffset ? maxLeftOffset : buttonLeftOffset
        categoryContainer.scrollLeft = leftOffset
      }
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
    async selectFiche(ficheCard) {
      try {
        this.loading = true
        this.selectedFiche = await this.fetchFicheBySlug(ficheCard.slug)
        this.ficheDialog = true
      } finally {
        this.loading = false
      }
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

.map-button {
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    left: 50%;
    transform: translateX(-50%);
    bottom: 64px;
    opacity: 0.9;
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    top: 94px;
    right: calc(50% - #{map-get($grid-breakpoints, 'md') / 2});
  }
}
</style>
