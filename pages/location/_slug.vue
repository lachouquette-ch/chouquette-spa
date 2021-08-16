<template>
  <v-container>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="scale-transition">
      <v-card tile>
        <v-toolbar flat>
          <v-toolbar-title>Filtrer</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Adresse Chouquettisée</v-list-item-title>
              <v-list-item-content>
                <p class="small">
                  Selectionner les adresses ayant le label Chouquettisé. C'est à dire testées et validées par l'équipe.
                  Qui respectent nos valeurs : Local, Ecologie, Equitable, Solidaire et Expertise
                </p>
                <v-btn></v-btn>
              </v-list-item-content>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Password</v-list-item-title>
              <v-list-item-subtitle
                >Require password for purchase or use password to restrict purchase</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <h1 class="text-h5 text-center mt-3">Lausanne et environs</h1>
    <div class="cq-scroll-x-container mt-4">
      <div class="d-inline-flex">
        <v-card v-for="topCategory in topCategories" :key="topCategory.id" width="200" class="mr-2" outlined flat>
          <v-list-item :key="topCategory.name">
            <v-list-item-avatar class="rounded-0">
              <WpMediaNew :media="topCategory.logoYellow" size="thumbnail"></WpMediaNew>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-subtitle v-html="topCategory.description"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </div>
    </div>
    <div class="cq-scroll-x-container mt-4">
      <div class="d-inline-flex">
        <v-chip v-for="topCategory in topCategories" :key="topCategory.id" class="mr-2" outlined>{{
          topCategory.name
        }}</v-chip>
      </div>
    </div>
    <div class="mt-4 d-inline-flex align-stretch">
      <v-text-field
        outlined
        label="Rechercher dans la categorie"
        prepend-inner-icon="mdi-magnify"
        dense
        clearable
        hide-details
        color="grey darker-3"
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
  computed: {
    ...mapState(['wordpressUrl']),
    ...mapState('categories', { topCategories: 'topLevels' }),
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
