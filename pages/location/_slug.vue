<template>
  <v-container>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="scale-transition">
      <v-card tile style="margin-bottom: 60px !important">
        <v-toolbar flat>
          <v-toolbar-title>Filtrer</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
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
                  <v-switch v-model="switch1" inset color="primary ml-auto"></v-switch>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-subheader class="text-h6 black--text">Destination</v-subheader>
            <v-list-item v-for="location in locations.slice(0, -1)" :key="location.id">
              <v-list-item-title>{{ location.name }}</v-list-item-title>
              <v-list-item-action>
                <v-checkbox hide-details></v-checkbox>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-container>
      </v-card>
      <v-footer fixed height="60" class="justify-space-around">
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
        dense
        clearable
        hide-details
        color="grey darken-3"
        class="mr-2"
      ></v-text-field>
      <div>
        <v-btn height="100%" outlined @click="dialog = true">
          <v-icon left>mdi-tune</v-icon>
          Filtrer
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import gql from 'graphql-tag'
import seo from '~/mixins/seo'
import { fiche as FicheFragments } from '~/apollo/fragments/fiche'
import { PER_PAGE_NUMBER } from '~/constants/default'
import WpMediaNew from '~/components/WpMediaNew'
import graphql from '~/mixins/graphql'

const MapStates = Object.freeze({
  HIDDEN: Symbol('hidden'),
  SHOWN: Symbol('shown'),
  UPDATED: Symbol('updated'),
})

export default {
  components: { WpMediaNew },
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

      dialog: true,
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
</style>
