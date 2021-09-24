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
                <h1 class="white--text font-weight-bold">les meilleures adresses locales et éco-responsables</h1>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedLocation"
                  label="Où veux-tu aller ?"
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
              <v-col cols="12" md="6" class="pt-0">
                <v-btn
                  block
                  elevation="3"
                  color="cq-yellow"
                  class="black--text"
                  x-large
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
      <h2 class="text-center">ARTICLES À LA UNE</h2>
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="py-0">
            <v-skeleton-loader
              v-if="$fetchState.pending"
              class="mx-auto mb-3"
              elevation="3"
              type="card"
            ></v-skeleton-loader>
            <v-card v-else class="mx-auto mb-5" :to="`/${highlightedPost.slug}`" nuxt ripple elevation="3">
              <WpMediaNew
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
              </WpMediaNew>
              <v-card-text>
                <v-card-title class="pa-0">
                  <h3>{{ highlightedPost.title }}</h3>
                </v-card-title>
              </v-card-text>
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
              <PostCard
                v-for="(post, i) in otherPosts"
                :key="post.id"
                :post="post"
                :class="{ 'mb-4': i < otherPosts.length - 1 }"
                :to="post.slug"
                nuxt
                large
                hide-meta
              ></PostCard>
            </template>
          </v-col>
        </v-row>
      </v-container>
      <div class="text-center mb-3">
        <v-btn text nuxt to="/articles" class="text-decoration-underline">tous nos articles</v-btn>
      </div>
    </v-sheet>

    <v-sheet class="cq-yellow">
      <v-container>
        <h2 class="text-center font-weight-bold text-lowercase my-5">les 5 valeurs de La Chouquette</h2>
        <v-carousel
          class="valeurs-carousel"
          height="400"
          show-arrows-on-hover
          hide-delimiter-background
          interval="3000"
        >
          <v-carousel-item v-for="value in values" :key="value.id">
            <v-card color="white" class="text-center mx-auto py-5" width="250">
              <v-card-title class="justify-center text-uppercase mb-5">
                <h3 class="valeur-title">{{ value.name }}</h3>
              </v-card-title>
              <WpMediaNew
                :media="value.image"
                size="thumbnail"
                width="100"
                height="100"
                contain
                class="mx-auto"
                flat
              ></WpMediaNew>
              <v-card-text class="text-body-1">{{ value.description }}</v-card-text>
              <v-card-actions class="justify-center">
                <v-btn text nuxt to="/articles" class="text-decoration-underline">en savoir plus</v-btn>
              </v-card-actions>
            </v-card>
          </v-carousel-item>
        </v-carousel>
      </v-container>
    </v-sheet>

    <v-sheet>
      <h2 class="text-center">Nos derniers tops</h2>
      <div class="cq-scroll-x-container px-3">
        <PostCard
          v-for="post in topPosts"
          :key="post.id"
          :post="post"
          :to="post.slug"
          nuxt
          vertical
          large
          hide-meta
        ></PostCard>
      </div>
      <div class="text-center my-3">
        <v-btn text nuxt to="/articles?topOnly=true" class="text-decoration-underline">tous nos tops</v-btn>
      </div>
    </v-sheet>

    <v-container class="cq-beige py-3" style="position: relative">
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
        <div class="cq-scroll-x-container my-5">
          <FicheCard
            v-for="fiche in latestChouquettises"
            :key="fiche.id"
            :fiche="fiche"
            :to="`/fiche/${fiche.slug}`"
            nuxt
          ></FicheCard>
        </div>
        <div class="text-center">
          <v-btn text nuxt to="/fiches?chouquettiseOnly=true" class="text-decoration-underline">tous nos Chouquettisés</v-btn>
        </div>
        <v-divider class="my-5"></v-divider>
        <div class="text-center">
          <p class="text-h3 font-weight-bold">notre label t'intéresse ?</p>
          <p class="text-h5">tu partages nos valeurs et souhaite en savoir comment obtenir ce label ?</p>
          <v-btn block elevation="3" color="cq-yellow" class="black--text my-5" large>Nous contacter</v-btn>
        </div>
      </div>
    </v-container>

    <Newsletter></Newsletter>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import {mapGetters, mapState} from 'vuex'

import {postCard as PostCardFragments} from '@/apollo/fragments/postCard'
import {fiche as FicheFragments} from '@/apollo/fragments/fiche'
import {seo as SeoFragments} from '@/apollo/fragments/seo'

import seo from '~/mixins/seo'
import graphql from '~/mixins/graphql'
import WpMediaNew from '~/components/WpMediaNew'
import PostCard from '~/components/PostCard'
import FicheCard from '~/components/FicheCard'
import Newsletter from '~/components/Newsletter'

export default {
  components: { Newsletter, FicheCard, PostCard, WpMediaNew },
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
      return [...this.locations, { divider: true }, { slug: '', name: 'Partout' }]
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
  font-family: $heading-font-family;
  letter-spacing: 1.5px !important;
  font-weight: 200 !important;
  text-transform: uppercase;
  margin: 2rem 0;
}
</style>
