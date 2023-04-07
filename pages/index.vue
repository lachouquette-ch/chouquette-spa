<template>
  <div>
    <v-card flat rounded="0">
      <v-img src="/banner-md.png" height="400" position="top center" class="cq-md-max-width mx-auto">
        <v-container fluid class="d-flex" style="height: 100%">
          <v-row align="top" justify="center">
            <v-col class="text-center" cols="12">
              <h1 class="primary--text font-weight-black">
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
        </v-container>
      </v-img>
    </v-card>

    <v-sheet class="cq-md-max-width py-5">
      <h2 class="text-center text-header--secondary my-5">ARTICLES À LA UNE</h2>
      <v-container v-if="$vuetify.breakpoint.mobile">
        <v-skeleton-loader
          v-if="$fetchState.pending"
          class="mx-auto mb-3"
          elevation="0"
          type="card"
          max-width="400"
        ></v-skeleton-loader>
        <v-card v-else class="mx-auto" :to="`/${highlightedPost.slug}`" nuxt ripple elevation="1" max-width="400">
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
                elevation="0"
                type="list-item-avatar, list-item-three-line"
                height="150"
                max-width="400"
              ></v-skeleton-loader>
            </v-col>
          </template>
          <template v-else>
            <v-col v-if="!$vuetify.breakpoint.mobile" cols="6">
              <PostCard :post="highlightedPost" class="my-2 mx-auto" large hide-meta transparent></PostCard>
            </v-col>
            <v-col v-for="post in otherPosts" :key="post.id" cols="12" md="6">
              <PostCard :post="post" class="my-2 mx-auto" large hide-meta transparent></PostCard>
            </v-col>
          </template>
        </v-row>
      </v-container>
      <div class="text-center mb-3">
        <v-btn text x-large nuxt to="/articles" class="text-decoration-underline">tous nos articles</v-btn>
      </div>
    </v-sheet>

    <v-sheet class="cq-yellow py-5">
      <v-container fluid>
        <h3 class="text-center font-weight-black text-h1 my-5">Les valeurs de La Chouquette</h3>
        <v-carousel
          v-if="$vuetify.breakpoint.mobile"
          class="valeurs-carousel"
          height="575"
          show-arrows-on-hover
          hide-delimiter-background
          interval="3000"
        >
          <v-carousel-item v-for="value in values" :key="value.id">
            <Value :value="value"></Value>
          </v-carousel-item>
        </v-carousel>
        <div v-else class="d-flex flex-wrap justify-center">
          <div v-for="value in values" :key="value.id" class="mx-5">
            <Value :value="value" class="ma-5"></Value>
          </div>
        </div>
      </v-container>
    </v-sheet>

    <v-sheet class="cq-md-max-width px-3 py-5">
      <h2 class="text-center text-header--secondary my-5">Nos derniers tops</h2>
      <v-skeleton-loader v-if="$fetchState.pending" class="mx-auto" max-width="300" type="card"></v-skeleton-loader>
      <template v-else>
        <ReponsiveScrollGrid :items="topPosts" md="4">
          <template #default="{ item }">
            <PostCard :post="item" class="mx-auto" vertical large hide-meta transparent></PostCard>
          </template>
        </ReponsiveScrollGrid>
        <div class="text-center my-3">
          <v-btn text x-large nuxt to="/articles?topOnly=true" class="text-decoration-underline">tous nos tops</v-btn>
        </div>
      </template>
    </v-sheet>

    <div class="cq-beige">
      <div class="cq-md-max-width pa-3" style="position: relative">
        <img
          src="/lachouquette_logo_simple_white.png"
          alt="Logo La Chouquette"
          height="120"
          style="position: absolute; left: 20px; top: -20px; transform: matrix(0.96, -0.29, 0.29, 0.96, 0, 0)"
        />
        <div style="position: relative" class="py-5">
          <div class="text-center">
            <h2 class="text-header--secondary">Nos Chouquettisés</h2>
            <p class="text-h5">
              Tous nos labellisés ont été testés et approuvés par La Chouquette. Ils répondent à nos valeurs et à nos
              critères. Tu peux y aller les yeux fermés !
            </p>
          </div>
          <v-skeleton-loader v-if="$fetchState.pending" class="mx-auto" max-width="300" type="card"></v-skeleton-loader>
          <template v-else>
            <ReponsiveScrollGrid :items="latestChouquettises" md="4">
              <template #default="{ item }">
                <FicheCard :fiche="item" class="mx-auto" height="100%"></FicheCard>
              </template>
            </ReponsiveScrollGrid>
            <div class="text-center">
              <v-btn
                text
                x-large
                nuxt
                to="/fiches?chouquettiseOnly=true"
                class="text-decoration-underline btn--hover-yellow"
                >voir tous nos Chouquettisés
              </v-btn>
            </div>
          </template>
          <v-divider class="my-5"></v-divider>
          <div class="text-center">
            <p class="text-h2 font-weight-black">Notre label t'intéresse ?</p>
            <p class="text-h5">Tu partages nos valeurs et tu souhaites savoir comment obtenir notre label ?</p>
            <v-btn
              :block="$vuetify.breakpoint.mobile"
              color="cq-yellow"
              class="black--text mb-3"
              large
              :to="labelPage"
              nuxt
              >On te dit tout</v-btn
            >
          </div>
        </div>
      </div>
    </div>

    <CommercialBanner></CommercialBanner>

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
import CommercialBanner from '~/components/CommercialBanner'
import Newsletter from '~/components/Newsletter'
import ReponsiveScrollGrid from '~/components/ReponsiveScrollGrid'
import Value from '~/components/Value'

export default {
  components: { Value, ReponsiveScrollGrid, CommercialBanner, Newsletter, FicheCard, PostCard, Media },
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
      strings: ['éco-responsables', 'culturelles', 'locales', 'insolites'],
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
    ...mapState(['name', 'description', 'labelPage']),
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
h1 {
  margin-top: 50px;
  margin-bottom: 100px;
  height: 2rem;
}

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
</style>
