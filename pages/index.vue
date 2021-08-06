<template>
  <div>
    <div class="header text-center white--text">
      <v-form class="header-form pa-5">
        <v-container fluid>
          <v-row>
            <v-col>
              <h2 class="text-h5">Trouve les meilleures adresses écoresponsables et locales</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                label="Où veux-tu aller ?"
                hide-details
                solo
                dense
                color="black"
                item-color="black"
                item-value="id"
                item-text="name"
                :items="locations"
              >
                <template slot="item" slot-scope="data">
                  <span v-if="data.item.level === 0" class="font-weight-bold">{{ data.item.name }} (canton)</span>
                  <span v-else class="pl-2">{{ data.item.name }}</span>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6" class="py-0">
              <v-btn block elevation="3" color="primary" class="black--text">Rechercher</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
    <v-sheet>
      <h3 class="text-center headline my-0 py-5">En ce moment</h3>
      <v-container>
        <template v-if="$fetchState.pending">
          <v-row>
            <v-col cols="12" md="6" class="py-0">
              <v-skeleton-loader
                v-for="i in 3"
                :key="i"
                class="mx-auto mb-3"
                elevation="1"
                max-width="350"
                type="card"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-col cols="12" md="6" class="py-0">
              <v-card class="post-thumb mx-auto mb-3" max-width="350" flat tile>
                <WpMediaNew
                  :media="highlightedPost.image"
                  size="medium_large"
                  height="250"
                  class="rounded"
                ></WpMediaNew>
                <v-card-title class="post-thumb-title mt-2 py-0 text-h6"
                  ><span class="text-break"
                    >{{ highlightedPost.title }}
                    <small class="ml-3 post-thumb-subtitle text-uppercase body-2">{{
                      getCategoryById(highlightedPost.categoryId).name
                    }}</small>
                  </span></v-card-title
                >
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="py-0">
              <v-container fluid class="py-0">
                <v-row v-for="post in otherPosts" :key="post.id" class="my-3">
                  <v-col cols="6" class="py-0 px-1">
                    <WpMediaNew
                      :media="post.image"
                      size="medium"
                      :aspect-ratio="16 / 9"
                      position="top center"
                      class="rounded"
                    ></WpMediaNew>
                  </v-col>
                  <v-col cols="6" class="py-0 px-1">
                    <p class="post-thumb-subtitle my-0 py-0 text-uppercase body-2 text-truncate">
                      {{ getCategoryById(post.categoryId).name }}
                    </p>
                    <p class="post-thumb-title mt-1 py-0 body-1 text-break">{{ post.title }}</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </template>
      </v-container>
      <div class="text-center my-3">
        <nuxt-link to="/articles" class="text-button">Tous nos articles</nuxt-link>
      </div>
    </v-sheet>

    <v-sheet class="green lighten-5 py-5">
      <h3 class="text-center headline">Les valeurs de La Chouquette</h3>
      <v-carousel class="valeurs-carousel" height="250" show-arrows-on-hover hide-delimiter-background interval="3000">
        <v-carousel-item v-for="valeur in valeurs" :key="valeur.name">
          <v-sheet height="100%" tile class="transparent">
            <v-row class="fill-height flex-column" align="center" justify="center">
              <v-btn fab dark color="green lighten-3" elevation="1">
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
      <h3 class="text-center headline pb-3">Nos derniers tops</h3>
      <div class="cq-scroll-x-container">
        <WpMediaNew
          v-for="post in topPosts"
          :key="post.id"
          :media="post.image"
          size="medium_large"
          class="rounded white--text align-center text-center"
          gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.6)"
          :aspect-ratio="4 / 3"
          width="60vw"
        >
          <v-card-title class="justify-center text-break">{{ post.title }}</v-card-title>
        </WpMediaNew>
      </div>
      <div class="text-center mt-5">
        <nuxt-link to="/tops" class="text-button">Tous les tops</nuxt-link>
      </div>
    </v-sheet>

    <v-sheet class="py-3">
      <h3 class="text-center headline">Nos Chouquettisés</h3>
      <p class="text-center text-subtitle-2 px-4">
        Ce sont les adresses testées et approuvées par la Chouquette. Ils sont membres de notre label : Chouquettisés et
        partagent ainsi les mêmes valeurs que les nôtres.
      </p>
      <div class="cq-scroll-x-container">
        <v-card v-for="i in 3" :key="i" class="transparent" flat tile hover>
          <v-img src="https://picsum.photos/175/175" class="rounded" :aspect-ratio="4 / 3" width="60vw"></v-img>
          <v-card-title class="text-h6 font-weight-bold pa-0 mt-1">Le Musée Olympique</v-card-title>
        </v-card>
      </div>
      <div class="text-center mt-5">
        <nuxt-link to="/tops" class="text-button">Tous nos Chouquettisés</nuxt-link>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { mapState, mapGetters } from 'vuex'

import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import { seo as SeoFragments } from '@/apollo/fragments/seo'

import seo from '~/mixins/seo'
import graphql from '~/mixins/graphql'
import WpMediaNew from '~/components/WpMediaNew'

export default {
  components: { WpMediaNew },
  mixins: [seo, graphql],
  async asyncData({ app }) {
    const yoast = await app.apolloProvider.defaultClient
      .query({
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
      .then(({ data }) => data.home.seo)

    return {
      yoast,
    }
  },
  data() {
    return {
      locations: [],
      latestPosts: [],
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
              topPosts {
                ...PostCardFragments
              }
            }
          }
          ${PostCardFragments}
        `,
      })

      const { latestPosts, topPosts } = data.home
      this.latestPosts = latestPosts
      this.topPosts = topPosts
    } catch (e) {
      this.$sentry.captureException(e)
      this.$nuxt.error({ statusCode: 500, message: this.parseGQLError(e) })
    }
  },
  fetchOnServer: false,
  computed: {
    ...mapState(['name', 'description', 'wordpressUrl']),
    ...mapState({
      categories: (state) => state.menus.headerCategories,
    }),
    ...mapGetters({
      getCategoryById: 'categories/getById',
    }),
    highlightedPost() {
      return this.latestPosts[0]
    },
    otherPosts() {
      // TODO latestPosts should only retrieve 4 posts
      return this.latestPosts.slice(1, 4)
    },
  },
  async created() {
    this.locations = await this.$store.dispatch('locations/flatLocations')
  },
  head() {
    return {
      title: this.yoast.title,
      meta: [
        ...this.seoMetaProperties(JSON.parse(this.yoast.metadata), true),
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
          name: this.yoast.title,
          description: this.seoGetDescription(JSON.parse(this.yoast.metadata)),
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
.header {
  background: url('https://cdn.vuetifyjs.com/images/cards/docks.jpg') no-repeat center center fixed;
  background-size: cover;
}
.header-form {
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%);
}

h3.headline {
  font-weight: bold;
  margin: 1rem 0;
}

.post-thumb-title {
  line-height: 1.5rem;
}
.post-thumb-subtitle {
  color: $chouquette-grey;
}
</style>
