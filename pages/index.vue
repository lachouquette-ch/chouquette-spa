<template>
  <div>
    <v-card flat>
      <v-img
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        gradient="to bottom, rgba(0,0,0,.6), rgba(0,0,0,.3)"
        class="rounded-0 align-center text-center"
        height="300"
      >
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <h2 class="text-h5 white--text">Trouve les meilleures adresses écoresponsables et locales</h2>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedLocation"
                  label="Où veux-tu aller ?"
                  hide-details
                  solo
                  dense
                  color="black"
                  item-color="black"
                  item-value="slug"
                  item-text="name"
                  :items="locations"
                >
                  <template slot="item" slot-scope="data">
                    <span v-if="data.item.level === 0" class="font-weight-bold">{{ data.item.name }} (canton)</span>
                    <span v-else class="pl-2">{{ data.item.name }}</span>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6" class="pt-0">
                <v-btn
                  block
                  dark
                  elevation="3"
                  color="primary"
                  class="black--text"
                  :disabled="!selectedLocation"
                  @click="goToLocation(selectedLocation)"
                  >Rechercher</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-img>
    </v-card>
    <v-sheet>
      <h3 class="text-center headline my-0 py-5">Articles à la une</h3>
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="py-0">
            <v-skeleton-loader
              v-if="$fetchState.pending"
              class="mx-auto mb-3"
              elevation="1"
              max-width="350"
              type="card"
            ></v-skeleton-loader>
            <v-card v-else class="mx-auto mb-3" max-width="350" flat hover ripple>
              <WpMediaNew
                :media="highlightedPost.image"
                size="medium_large"
                aspect-ratio="1"
                width="100%"
                class="rounded"
              ></WpMediaNew>
              <v-card-title class="pa-0 mt-1 text-break">
                {{ highlightedPost.title }}
                <v-card-subtitle class="text-uppercase ma-0 pa-0">{{
                  getCategoryById(highlightedPost.categoryId).name
                }}</v-card-subtitle>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" class="py-0">
            <template v-if="$fetchState.pending">
              <v-skeleton-loader
                v-for="i in 3"
                :key="i"
                class="mb-3"
                elevation="1"
                type="list-item-avatar-three-line"
              ></v-skeleton-loader>
            </template>
            <template v-else>
              <PostCard v-for="post in otherPosts" :key="post.id" :post="post" class="mb-3"></PostCard>
            </template>
          </v-col>
        </v-row>
      </v-container>
      <div class="text-center mb-3">
        <nuxt-link to="/articles" class="text-button">Tous nos articles</nuxt-link>
      </div>
    </v-sheet>

    <v-sheet class="green-chouquette lighten-1 py-5">
      <h3 class="text-center headline">Les valeurs de La Chouquette</h3>
      <v-carousel class="valeurs-carousel" height="250" show-arrows-on-hover hide-delimiter-background interval="3000">
        <v-carousel-item v-for="valeur in valeurs" :key="valeur.name">
          <v-sheet height="100%" tile class="transparent">
            <v-row class="fill-height flex-column" align="center" justify="center">
              <v-btn fab dark color="green-chouquette" elevation="1">
                <v-icon>{{ valeur.icon }}</v-icon>
              </v-btn>
              <h6 class="text-h5 my-3">{{ valeur.name }}</h6>
              <p>{{ valeur.description }}</p>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-sheet>

    <v-sheet class="pt-5">
      <h3 class="text-center headline">Nos Chouquettisés</h3>
      <p class="text-center text-subtitle-2 px-4">
        Ce sont les adresses testées et approuvées par la Chouquette. Ils sont membres de notre label : Chouquettisés et
        partagent ainsi les mêmes valeurs que les nôtres.
      </p>
      <div class="cq-scroll-x-container px-3">
        <FicheCard v-for="fiche in latestChouquettises" :key="fiche.id" :fiche="fiche"></FicheCard>
      </div>
      <div class="text-center">
        <nuxt-link to="/tops" class="text-button">Tous nos Chouquettisés</nuxt-link>
      </div>
    </v-sheet>

    <v-sheet class="py-3">
      <h3 class="text-center headline pb-3">Nos derniers tops</h3>
      <div class="cq-scroll-x-container px-3">
        <v-card v-for="post in topPosts" :key="post.id" flat hover ripple>
          <WpMediaNew
            :media="post.image"
            size="medium_large"
            class="rounded white--text align-center text-center"
            gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.6)"
            aspect-ratio="1"
            width="60vw"
          >
            <v-chip color="white" small class="ma-2" style="opacity: 0.9; position: absolute; top: 0; left: 0">
              Top
            </v-chip>
            <v-card-title class="justify-center text-break">{{ post.title }}</v-card-title>
          </WpMediaNew>
        </v-card>
      </div>
      <div class="text-center">
        <nuxt-link to="/tops" class="text-button">Tous les tops</nuxt-link>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { mapState, mapGetters } from 'vuex'

import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import { fiche as FicheFragments } from '@/apollo/fragments/fiche'
import { seo as SeoFragments } from '@/apollo/fragments/seo'

import seo from '~/mixins/seo'
import graphql from '~/mixins/graphql'
import WpMediaNew from '~/components/WpMediaNew'
import PostCard from '~/components/PostCard'
import FicheCard from '~/components/FicheCard'

export default {
  components: { FicheCard, PostCard, WpMediaNew },
  mixins: [seo, graphql],
  async asyncData({ store, app }) {
    // store initialization
    await store.dispatch('nuxtServerInit')

    const { data } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query {
          home {
            seo {
              ...SeoFragments
            }
          }
        }
        ${SeoFragments}
      `,
    })

    return {
      seo: data.home.seo,
    }
  },
  data() {
    return {
      selectedLocation: null,
      latestPosts: [],
      latestChouquettises: [],
      topPosts: [],

      valeurs: [
        { name: "L'écologie", description: 'Blablabla ljfalsdf lasdfkj lasdfkjalsdfj', icon: 'mdi-leaf' },
        { name: 'Le local', description: 'Blablabla ljfalsdf lasdfkj lasdfkjalsdfj', icon: 'mdi-map-marker-circle' },
        {
          name: 'Le solidaire',
          description: 'Blablabla ljfalsdf lasdfkj lasdfkjalsdfj',
          icon: 'mdi-handshake-outline',
        },
      ],
    }
  },
  async fetch() {
    try {
      const { data } = await this.$apollo.query({
        query: gql`
          query {
            home {
              latestPosts {
                ...PostCardFragments
              }
              latestChouquettises {
                ...FicheFragments
              }
              topPosts {
                ...PostCardFragments
              }
            }
          }
          ${PostCardFragments}
          ${FicheFragments}
        `,
      })

      const { latestPosts, latestChouquettises, topPosts } = data.home
      this.latestPosts = latestPosts
      this.latestChouquettises = latestChouquettises
      this.topPosts = topPosts
    } catch (e) {
      this.$sentry.captureException(e)
      this.$nuxt.error({ statusCode: 500, message: this.parseGQLError(e) })
    }
  },
  fetchOnServer: true,
  methods: {
    goToLocation(location) {
      this.$router.push(`/location/${location}`)
    },
  },
  computed: {
    ...mapState(['name', 'description', 'wordpressUrl']),
    ...mapState({
      categories: (state) => state.menus.headerCategories,
      locations: (state) => state.locations.flatSorted,
    }),
    ...mapGetters('categories', { getCategoryById: 'getById' }),
    highlightedPost() {
      return this.latestPosts[0]
    },
    otherPosts() {
      return this.latestPosts.slice(1)
    },
  },
  head() {
    return {
      title: this.seo.title,
      meta: [
        ...this.seoMetaProperties(JSON.parse(this.seo.metadata), true),
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${this.wordpressUrl}/logo.png`,
        },
      ],
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.seo.title,
          description: this.seoGetDescription(JSON.parse(this.seo.metadata)),
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

<style lang="scss" scoped>
h3.headline {
  font-weight: bold;
  margin: 1rem 0;
}
</style>
