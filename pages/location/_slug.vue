<template>
  <v-container>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="scale-transition">
      <v-app-bar class="filter-header" color="white" fixed flat>
        <v-toolbar-title>Filtrer</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card class="filter-content" tile>
        <v-container>
          <v-list>
            <v-subheader class="text-h6 black--text">Adresse Chouquettisée</v-subheader>
            <v-list-item three-line>
              <v-list-item-content class="pt-0">
                <div class="d-inline-flex align-center mt-1">
                  <p class="body-2 secondary--text text--lighten-2 ma-0">
                    Sélectionner que les adresses testées et approuvées par l'équipe. tesa fadsf
                    kldasjféladsjféalsdfkjasdélf jasdf
                  </p>
                  <v-switch color="primary ml-auto" inset :ripple="false"></v-switch>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <FilterExpansion title="Destination" :items="locations"></FilterExpansion>
        </v-container>
      </v-card>
      <v-footer class="filter-bottom justify-space-around" color="white" fixed>
        <v-btn outlined class="flex-grow-2 mx-1">Tout effacer</v-btn>
        <v-btn dark class="flex-grow-1 mx-1">Appliquer</v-btn>
      </v-footer>
    </v-dialog>

    <h1 class="text-h5 text-center mt-3">Lausanne et environs</h1>
    <div class="cq-scroll-x-container mt-4">
      <div class="d-inline-flex">
        <button
          v-for="topCategory in topCategories"
          :key="topCategory.id"
          v-ripple
          class="top-category-btn rounded mr-2"
          :class="{ 'grey darken-3': topCategory === selectedTopCategory }"
          :disabled="$fetchState.pending"
          @click="selectTopCategory(topCategory)"
        >
          <v-list-item two-line>
            <v-list-item-avatar class="rounded-0">
              <WpMediaNew
                v-if="topCategory === selectedTopCategory"
                :media="topCategory.logoWhite"
                size="thumbnail"
              ></WpMediaNew>
              <WpMediaNew v-else :media="topCategory.logoBlack" size="thumbnail"></WpMediaNew>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title :class="{ 'yellow--text': topCategory === selectedTopCategory }">{{
                topCategory.name
              }}</v-list-item-title>
              <v-list-item-subtitle :class="{ 'white--text': topCategory === selectedTopCategory }">{{
                topCategory.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </button>
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
          @click="selectSubCategory(subCategory)"
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
      ></v-text-field>
      <div>
        <v-btn height="100%" outlined @click="dialog = true">
          <v-icon left>mdi-tune</v-icon>
          Filtrer
        </v-btn>
      </div>
    </div>
    <template v-if="fiches.length">
      <v-subheader class="px-0 text-body-2">{{ fichesTotal }} résultats</v-subheader>
      <v-card v-for="fiche in fiches" :key="fiche.id" class="mb-3" outlined height="450" bench="2">
        <WpMediaNew :media="fiche.image" size="medium_large" height="200" contains>
          <v-chip v-if="fiche.isChouquettise" color="primary" text-color="black" class="ma-2" small>
            Testé et Chouquettisé
            <v-icon right>mdi-check</v-icon>
          </v-chip>
        </WpMediaNew>
        <v-card-title class="text-h5 d-block text-break">{{ fiche.title }}</v-card-title>
        <v-card-subtitle class="text-uppercase">{{ getCategoryById(fiche.principalCategoryId).name }}</v-card-subtitle>
        <v-card-text class="black--text">
          <div class="fiche-content" v-html="fiche.content"></div>
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
      <v-btn color="secondary" :loading="$fetchState.pending" :disabled="!hasMoreFiches" block outlined @click="$fetch">
        Plus d'adresses
      </v-btn>
    </template>
    <div v-else-if="$fetchState.pending" class="mt-3">
      <v-skeleton-loader
        v-for="i in 3"
        :key="i"
        class="mb-3"
        elevation="1"
        type="image, article, actions"
      ></v-skeleton-loader>
    </div>
    <v-alert
      v-else
      border="bottom"
      color="primary lighten-3"
      class="mt-3 mb-0 text-center"
      elevation="2"
      colored-border
    >
      Aucun résultat
    </v-alert>
    <ScrollTop></ScrollTop>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import gql from 'graphql-tag'
import seo from '~/mixins/seo'
import { fiche as FicheFragments } from '~/apollo/fragments/fiche'
import { PER_PAGE_NUMBER } from '~/constants/default'
import WpMediaNew from '~/components/WpMediaNew'
import graphql from '~/mixins/graphql'
import FilterExpansion from '~/components/FilterExpansion'
import ScrollTop from '~/components/ScrollTop'

const MapStates = Object.freeze({
  HIDDEN: Symbol('hidden'),
  SHOWN: Symbol('shown'),
  UPDATED: Symbol('updated'),
})

export default {
  components: { FilterExpansion, WpMediaNew, ScrollTop },
  mixins: [seo, graphql],
  async asyncData({ store, params, query }) {
    const location = await store.dispatch('locations/getBySlug', params.slug)

    const category = store.dispatch('categories/getBySlug', query.category)
    let selectedTopCategory = null
    let selectedSubCategory = null
    if (category.parentId) {
      selectedSubCategory = category
      selectedTopCategory = store.dispatch('categories/getById', category.parentId)
    } else {
      selectedTopCategory = category
    }

    const search = query.search
    // const criteria = Object.entries(query)
    //   .filter(([key]) => key.startsWith('cq_'))
    //   .map(([key, value]) => {
    //     return { taxonomy: key, values: value.split(',') }
    //   })

    return {
      location,
      search,
      selectedTopCategory,
      selectedSubCategory,
    }
  },
  data() {
    return {
      fichesNextPage: 1,
      fiches: [],
      fichesTotal: null,
      fichesPages: null,
      hasMoreFiches: false,

      selectedTopCategory: null,
      selectedSubCategory: null,
      subCategories: [],

      dialog: false,
    }
  },
  async fetch() {
    try {
      const queryLocation = this.location.slug
      const querySearch = this.search
      // select category
      let queryCategory = null
      if (this.selectedSubCategory) {
        queryCategory = this.selectedSubCategory.slug
      } else if (this.selectedTopCategory) {
        queryCategory = this.selectedTopCategory.slug
      }

      const { data } = await this.$apollo.query({
        query: gql`
          query (
            $category: String
            $location: String
            $search: String
            $criteria: [CriteriaSearch!]
            $page: Int!
            $pageSize: Int!
          ) {
            fichesByFilters(
              slug: $category
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
          location: queryLocation,
          category: queryCategory,
          search: querySearch,
          // criteria: this.criteria,
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
  methods: {
    ...mapActions('categories', {
      getCategoryById: 'getById',
      getCategoriesByParentId: 'getChildrenForId',
    }),
    async selectTopCategory(topCategory) {
      this.selectedTopCategory = topCategory
      this.selectedSubCategory = null
      this.subCategories = await this.getCategoriesByParentId(topCategory.id)

      this.fichesNextPage = 1
      this.fiches = []
      this.$router.replace({ query: { category: topCategory.slug } })
      this.$fetch()
    },
    selectSubCategory(category) {
      this.selectedSubCategory = category

      this.fichesNextPage = 1
      this.fiches = []
      this.$router.replace({ query: { category: category.slug } })
      this.$fetch()
    },
    searchByText() {
      this.fichesNextPage = 1
      this.fiches = []
      this.$router.replace({ query: { search: this.search } })
      this.$fetch()
    },
    sampleCriteriaValues(fiche) {
      return fiche.criteria.flatMap(({ values }) => values).slice(0, 3)
    },
  },
  computed: {
    ...mapState(['wordpressUrl']),
    ...mapState('categories', { topCategories: 'topLevels' }),
    ...mapState('locations', { locations: 'flatSorted' }),
  },
  head() {
    return {
      title: this.location.name,
      meta: this.seoMetaProperties([
        {
          name: 'description',
          content: this.$options.filters.heDecode(this.location.description || this.location.name),
        },

        { property: 'og:type', content: 'article' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:url', content: this.currentURL },
        { property: 'og:title', content: this.$options.filters.heDecode(this.location.name) },
        {
          property: 'og:description',
          content: this.$options.filters.heDecode(this.location.description || this.location.name),
        },
        { property: 'og:image', content: '' },

        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: this.$options.filters.heDecode(this.location.name) },
        {
          name: 'twitter:description',
          content: this.$options.filters.heDecode(this.location.description || this.location.name),
        },
        { name: 'twitter:image', content: '' },
      ]),
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.$options.filters.heDecode(this.location.name),
          description: this.$options.filters.heDecode(this.location.description || this.location.name),
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

.filter-content.v-card.v-sheet {
  margin-top: 56px !important;
  margin-bottom: 60px !important;
}

.filter-header {
  height: 56px;
}

.filter-bottom {
  height: 60px;
}

.fiche-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
