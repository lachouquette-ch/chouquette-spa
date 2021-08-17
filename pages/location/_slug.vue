<template>
  <v-container>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="scale-transition">
      <v-app-bar class="filter-header" height="56" color="white" fixed flat>
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
                  <v-switch v-model="switch1" color="primary ml-auto" inset :ripple="false"></v-switch>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <FilterExpansion title="Destination" :items="locations"></FilterExpansion>
        </v-container>
      </v-card>
      <v-divider></v-divider>
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
    <div v-if="categories.length" class="cq-scroll-x-container mt-1">
      <div class="d-inline-flex">
        <v-chip
          v-for="category in categories"
          :key="category.id"
          class="mr-2"
          :dark="category === selectedCategory"
          label
          @click="selectCategory(category)"
          >{{ category.name }}</v-chip
        >
      </div>
    </div>
    <div class="mt-1 d-inline-flex align-stretch">
      <v-text-field
        outlined
        label="Rechercher dans la categorie"
        prepend-inner-icon="mdi-magnify"
        color="grey darken-3"
        class="mr-2"
        clearable
        hide-details
        dense
      ></v-text-field>
      <div>
        <v-btn height="100%" outlined @click="dialog = true">
          <v-icon left>mdi-tune</v-icon>
          Filtrer
        </v-btn>
      </div>
    </div>
    <div v-if="$fetchState.pending" class="mt-3">
      <v-skeleton-loader
        v-for="i in 3"
        :key="i"
        class="mb-3"
        elevation="1"
        type="image, article, actions"
      ></v-skeleton-loader>
    </div>
    <template v-else>
      <v-subheader class="px-0 text-body-2">{{ fichesTotal }} résultats</v-subheader>
      <v-card v-for="fiche in fiches" :key="fiche.id" class="mb-3">
        <WpMediaNew :media="fiche.image" size="medium_large" height="200" contains></WpMediaNew>
        <v-card-title class="text-h5">{{ fiche.title }}</v-card-title>
        <v-card-subtitle class="text-uppercase">{{ getCategoryById(fiche.principalCategoryId).name }}</v-card-subtitle>
        <v-card-text class="black--text">
          <div v-html="fiche.content"></div>
          <v-chip-group>
            <v-chip color="primary lighten-1" text-color="grey darken-3" label small>Test</v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
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

const MapStates = Object.freeze({
  HIDDEN: Symbol('hidden'),
  SHOWN: Symbol('shown'),
  UPDATED: Symbol('updated'),
})

export default {
  components: { FilterExpansion, WpMediaNew },
  mixins: [seo, graphql],
  async asyncData({ store, params }) {
    const rootLocation = await store.dispatch('locations/getBySlug', params.slug)

    return {
      rootLocation,
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
      selectedCategory: null,
      categories: [],

      dialog: false,
    }
  },
  async fetch() {
    try {
      const queryLocation = this.$route.params.location || this.rootLocation.slug
      const queryCategory = this.$route.params.category
      const querySearch = this.$route.params.search
      const queryCriteria = Object.entries(this.$route.params)
        .filter(([key]) => key.startsWith('cq_'))
        .map(([key, value]) => {
          return { taxonomy: key, values: value.split(',') }
        })

      const { data } = await this.$apollo.query({
        query: gql`
          query (
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
          slug: queryCategory,
          location: queryLocation,
          search: querySearch,
          criteria: queryCriteria,
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
    selectTopCategory(topCategory) {
      this.selectedTopCategory = topCategory
      this.selectedCategory = null
      this.categories = this.$store.getters['categories/getChildrenForId'](topCategory.id)
    },
    selectCategory(category) {
      this.selectedCategory = category
    },
  },
  computed: {
    ...mapState(['wordpressUrl']),
    ...mapState('categories', { topCategories: 'topLevels' }),
    ...mapState('locations', { locations: 'flatSorted' }),
    ...mapGetters({
      getCategoryById: 'categories/getById',
    }),
  },
  head() {
    return {
      title: this.rootLocation.name,
      meta: this.seoMetaProperties([
        {
          name: 'description',
          content: this.$options.filters.heDecode(this.rootLocation.description || this.rootLocation.name),
        },

        { property: 'og:type', content: 'article' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:url', content: this.currentURL },
        { property: 'og:title', content: this.$options.filters.heDecode(this.rootLocation.name) },
        {
          property: 'og:description',
          content: this.$options.filters.heDecode(this.rootLocation.description || this.rootLocation.name),
        },
        { property: 'og:image', content: '' },

        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: this.$options.filters.heDecode(this.rootLocation.name) },
        {
          name: 'twitter:description',
          content: this.$options.filters.heDecode(this.rootLocation.description || this.rootLocation.name),
        },
        { name: 'twitter:image', content: '' },
      ]),
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.$options.filters.heDecode(this.rootLocation.name),
          description: this.$options.filters.heDecode(this.rootLocation.description || this.rootLocation.name),
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
}

.filter-content.v-card.v-sheet {
  margin-top: 56px !important;
  margin-bottom: 60px !important;
}

.filter-header {
  height: 56px;
  border-bottom: 1px solid var(--v-secondary-base);
}

.filter-bottom {
  height: 60px;
}
</style>
