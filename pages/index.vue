<template>
  <div>
    <v-parallax src="/banner-md.png" height="400">
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="primary--text font-weight-black mb-3 mb-md-5">
            les meilleures adresses <span id="typed">locales et éco-responsables</span>
          </h1>
          <v-container class="cq-sm-max-width">
            <v-row class="justify-center align-center" no-gutters>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedLocation"
                  label="Où veux-tu aller ?"
                  class="mr-md-3"
                  hide-details
                  solo
                  rounded
                  color="black"
                  item-color="black"
                  item-value="slug"
                  item-text="name"
                  :items="locationsPlusAll"
                >
                  <template #item="data">
                    <span v-if="data.item.level === 0" class="font-weight-bold">{{ data.item.name }} (canton)</span>
                    <span v-else-if="data.item.slug === ''" class="font-weight-bold">{{ data.item.name }}</span>
                    <span v-else class="pl-2">{{ data.item.name }}</span>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  block
                  elevation="3"
                  color="cq-yellow"
                  class="black--text mt-2 mt-md-0"
                  x-large
                  @click="goToLocation(selectedLocation)"
                  >J'explore</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-parallax>

    <v-sheet class="cq-md-max-width">
      <h2 class="text-center my-5">ARTICLES À LA UNE</h2>
      <v-container v-if="$vuetify.breakpoint.mobile">
        <v-skeleton-loader
          v-if="$fetchState.pending"
          class="mx-auto mb-3"
          elevation="3"
          type="card"
          max-width="400"
        ></v-skeleton-loader>
        <v-card v-else class="mx-auto" :to="`/${highlightedPost.slug}`" nuxt ripple elevation="3" max-width="400">
          <Media
            v-if="highlightedPost.image"
            :media="highlightedPost.image"
            size="medium_large"
            aspect-ratio="1"
            height="200"
            width="100%"
          >
            <v-card-subtitle class="pa-2">
              <v-chip color="white" small>
                {{ getCategoryById(highlightedPost.categoryId).name }}
              </v-chip>
            </v-card-subtitle>
          </Media>
          <v-card-text>
            <v-card-title class="pa-0">
              <h3>{{ highlightedPost.title }}</h3>
            </v-card-title>
          </v-card-text>
        </v-card>
      </v-container>
      <v-container>
        <v-row>
          <template v-if="$fetchState.pending">
            <v-col v-for="i in 4" :key="i" cols="12" md="6">
              <v-skeleton-loader
                class="my-2 mx-auto pa-2"
                elevation="1"
                type="list-item-avatar, list-item-three-line"
                height="150"
                max-width="400"
              ></v-skeleton-loader>
            </v-col>
          </template>
          <template v-else>
            <v-col v-if="!$vuetify.breakpoint.mobile" cols="6">
              <PostCard :post="highlightedPost" class="my-2 mx-auto" large hide-meta></PostCard>
            </v-col>
            <v-col v-for="post in otherPosts" :key="post.id" cols="12" md="6">
              <PostCard :post="post" class="my-2 mx-auto" large hide-meta></PostCard>
            </v-col>
          </template>
        </v-row>
      </v-container>
      <div class="text-center mb-3">
        <v-btn text x-large nuxt to="/articles" class="text-decoration-underline">tous nos articles</v-btn>
      </div>
    </v-sheet>

    <v-sheet class="cq-yellow">
      <v-container class="cq-md-max-width">
        <h3 class="text-center font-weight-black text-h2 text-lowercase my-5">les 5 valeurs de La Chouquette</h3>
        <v-carousel
          v-if="$vuetify.breakpoint.mobile"
          class="valeurs-carousel"
          height="500"
          show-arrows-on-hover
          hide-delimiter-background
          interval="3000"
        >
          <v-carousel-item v-for="value in values" :key="value.id">
            <Value :value="value"></Value>
          </v-carousel-item>
        </v-carousel>
        <v-container v-else>
          <v-row align="center" justify="center">
            <v-col v-for="value in values" :key="value.id" cols="4">
              <Value :value="value"></Value>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-sheet>

    <v-sheet class="cq-md-max-width px-3">
      <h2 class="text-center my-5">Nos derniers tops</h2>
      <ReponsiveScrollGrid :items="topPosts" md="4">
        <template #default="{ item }">
          <PostCard :post="item" class="mx-auto" vertical large hide-meta></PostCard>
        </template>
      </ReponsiveScrollGrid>
      <div class="text-center my-3">
        <v-btn text x-large nuxt to="/articles?topOnly=true" class="text-decoration-underline">tous nos tops</v-btn>
      </div>
    </v-sheet>

    <div class="cq-beige">
      <div class="cq-md-max-width pa-3" style="position: relative">
        <img
          src="/lachouquette_logo_simple_white.png"
          alt="Logo La Chouquette"
          height="120"
          style="position: absolute; left: 20px; top: -20px; transform: matrix(0.96, -0.29, 0.29, 0.96, 0, 0)"
        />
        <div style="position: relative">
          <div class="text-center">
            <h2>Nos Chouquettisés</h2>
            <p class="text-h5">Tous ont été testé et approuvé selon nos valeurs écoresponsables</p>
          </div>
          <ReponsiveScrollGrid :items="latestChouquettises" md="4">
            <template #default="{ item }">
              <FicheCard :fiche="item" class="mx-auto" height="100%"></FicheCard>
            </template>
          </ReponsiveScrollGrid>
          <div class="text-center">
            <v-btn text x-large nuxt to="/fiches?chouquettiseOnly=true" class="text-decoration-underline"
              >tous nos Chouquettisés
            </v-btn>
          </div>
          <v-divider class="my-5"></v-divider>
          <div class="text-center">
            <p class="text-h2 font-weight-black">notre label t'intéresse ?</p>
            <p class="text-h5">tu partages nos valeurs et souhaite en savoir comment obtenir ce label ?</p>
            <v-btn elevation="3" :block="$vuetify.breakpoint.mobile" color="cq-yellow" class="black--text mb-3" large
              >Nous contacter</v-btn
            >
          </div>
        </div>
      </div>
    </div>

    <Newsletter></Newsletter>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters, mapState } from 'vuex'

import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import { fiche as FicheFragments } from '@/apollo/fragments/fiche'
import { seo as SeoFragments } from '@/apollo/fragments/seo'

import seo from '~/mixins/seo'
import graphql from '~/mixins/graphql'
import Media from '~/components/Media'
import PostCard from '~/components/PostCard'
import FicheCard from '~/components/FicheCard'
import Newsletter from '~/components/Newsletter'
import ReponsiveScrollGrid from '~/components/ReponsiveScrollGrid'
import Value from '~/components/Value'

export default {
  components: { Value, ReponsiveScrollGrid, Newsletter, FicheCard, PostCard, Media },
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
      selectedLocation: '',
      latestPosts: [],
      latestChouquettises: [],
      topPosts: [],
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
  mounted() {
    const Typed = require('typed.js')
    // eslint-disable-next-line no-new
    new Typed('#typed', {
      strings: ['locales', 'éco-responsables'],
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      showCursor: false,
      onBegin(self) {
        self.currentElContent = ''
      },
    })
  },
  methods: {
    goToLocation(location) {
      this.$router.push(`/fiches/${location}`)
    },
  },
  computed: {
    ...mapState(['name', 'description']),
    ...mapState({
      categories: (state) => state.menus.headerCategories,
      locations: (state) => state.locations.flatSorted,
      values: (state) => state.values.flat,
    }),
    ...mapGetters('categories', { getCategoryById: 'getById' }),
    highlightedPost() {
      return this.latestPosts[0]
    },
    otherPosts() {
      return this.latestPosts.slice(1)
    },
    locationsPlusAll() {
      return [{ slug: '', name: 'Partout' }, { divider: true }, ...this.locations]
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
          content: `${this.$config.siteUrl}/logo.png`,
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
            logo: `${this.$config.siteUrl}/logo.png`,
          },
          url: this.$config.siteUrl,
        }),
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
button.v-btn.cq-yellow {
  @include hover-focus-active {
    background-color: var(--v-cq-red-base) !important;
    color: white !important;
  }
}

.valeur-title {
  display: inline-block;
  font-family: $heading-font-family;
  font-weight: normal;
  border: 2px solid var(--v-primary-base);
  padding: 5px 12px;
  font-size: 1.5rem;
  letter-spacing: 3px;
}

h2 {
  font-family: $secondary-font-family !important;
  letter-spacing: 1.5px !important;
  font-weight: normal !important;
  text-transform: uppercase;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
