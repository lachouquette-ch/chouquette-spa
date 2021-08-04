<template>
  <div>
    <div class="header text-center white--text">
      <v-form class="header-form pa-5">
        <v-container fluid>
          <v-row>
            <v-col>
              <h2 class="text-h5">Trouve les meilleures adresses écoresponsables et locals</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select label="Où veux-tu aller ?" hide-details solo dense></v-select>
            </v-col>
            <v-col cols="12" md="6" class="py-0">
              <v-btn block elevation="3" color="primary" class="black--text">Rechercher</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
    <v-container>
      <v-row>
        <v-col>
          <h3 class="text-center headline">En ce moment</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" class="pb-0">
          <v-card class="post-thumb mx-auto" max-width="350" flat tile>
            <v-img height="250" src="https://picsum.photos/350/250" class="rounded"></v-img>
            <v-card-title class="post-thumb-title mt-2 py-0 text-h6"
              >Le TOM Café et son petit dernier le TOM snack !</v-card-title
            >
            <v-card-subtitle class="post-thumb-subtitle mt-2 py-0 text-uppercase body-2">Bars et restaurants</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="py-0">
          <v-container fluid class="py-0">
            <v-row v-for="i in 3" :key="i" class="my-2">
              <v-col cols="6" class="py-0 px-1">
                <v-img
                  :aspect-ratio="16 / 9"
                  src="https://picsum.photos/350/150"
                  position="top center"
                  class="rounded"
                ></v-img>
              </v-col>
              <v-col cols="6" class="py-0 px-1">
                <p class="post-thumb-subtitle my-0 py-0 text-uppercase body-2">Bars et restaurants</p>
                <p class="post-thumb-title mt-1 py-0 body-1">Le TOM Café et son petit dernier le TOM snack !</p>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <nuxt-link to="/articles" class="secondary--text">Tous nos articles</nuxt-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { mapState } from 'vuex'

import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import { seo as SeoFragments } from '@/apollo/fragments/seo'

import seo from '~/mixins/seo'
import graphql from '~/mixins/graphql'

export default {
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
    return {}
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
    ...mapState({
      categories: (state) => state.menus.headerCategories,
    }),
    ...mapState(['name', 'description', 'wordpressUrl']),
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

.post-thumb-title {
  line-height: 1.5rem;
}
.post-thumb-subtitle {
  color: $chouquette-grey;
}
</style>
