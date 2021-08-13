<template>
  <v-container>
    <h1 class="text-h5 text-center mt-3 mb-5">Lausanne et environs</h1>
    <div v-if="getTopLevels">
      <div class="cq-scroll-x-container">
        <div class="d-inline-flex">
          <v-card
            v-for="topCategory in getTopLevels"
            :key="topCategory.id"
            class="grey darken-3 d-flex align-center mr-2"
            height="70"
            width="180"
            dark
            ripple
          >
            <h2 class="text-h6 pa-3" style="line-height: 1.5rem">{{ topCategory.name }}</h2>
            <div class="ml-auto pa-3">
              <WpMediaNew :media="topCategory.logoYellow" size="thumbnail" aspect-ratio="1" width="40"></WpMediaNew>
            </div>
          </v-card>
        </div>
      </div>
    </div>
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

const MapStates = Object.freeze({
  HIDDEN: Symbol('hidden'),
  SHOWN: Symbol('shown'),
  UPDATED: Symbol('updated'),
})

export default {
  components: { WpMediaNew },
  mixins: [seo, graphql],
  async asyncData({ store, params, query }) {
    // store initialization
    await store.dispatch('nuxtServerInit')

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
  computed: {
    ...mapState(['wordpressUrl']),
    ...mapGetters({
      getTopLevels: 'categories/getTopLevels',
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

<style scoped></style>
