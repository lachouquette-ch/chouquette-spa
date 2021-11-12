<template>
  <div class="cq-md-max-width">
    <div class="d-flex justify-center align-center my-4">
      <v-text-field
        v-if="toggleSearch"
        v-model="search"
        placeholder="Je cherche..."
        autofocus
        prepend-icon="mdi-close"
        append-outer-icon="mdi-send"
        clear-icon="mdi-close-circle-outline"
        outlined
        clearable
        hide-details
        dense
        style="max-width: 350px"
        @change="update"
        @click:prepend="toggleSearch = false"
      ></v-text-field>
      <template v-else>
        <h1 class="text-center">
          <span v-if="$fetchState.pending">En cours de recherche pour {{ search }}</span>
          <span v-else>{{ totalResultCount }} résultats pour "{{ search }}"</span>
        </h1>
        <v-btn v-if="!$fetchState.pending" class="mx-2" icon small @click="toggleSearch = true">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </div>

    <template v-if="$fetchState.pending">
      <v-container style="height: 300px" class="d-flex justify-center align-center">
        <v-progress-circular color="secondary" indeterminate size="64"></v-progress-circular>
      </v-container>
    </template>
    <template v-else-if="totalResultCount === 0">
      <div class="px-4">
        <v-alert border="bottom" color="primary" class="text-center" elevation="2" colored-border width="100%">
          Aucun résultat pour ta recherche.
          <a href="" class="ml-1" @click.prevent="toggleSearch = true">Modifier ma recherche</a>
        </v-alert>
      </div>
    </template>
    <template v-else-if="!$vuetify.breakpoint.mobile">
      <v-tabs v-model="tab" background-color="transparent" centered grow class="mt-3">
        <v-tab key="adresses" :disabled="fichesTotal === 0">
          <v-icon left>mdi-map-marker-multiple-outline</v-icon>
          Addresses <span v-if="!fichesLoading" class="ml-1">({{ fichesTotal }})</span>
        </v-tab>
        <v-tab key="articles" :disabled="postsTotal === 0">
          <v-icon left>mdi-newspaper-variant-multiple</v-icon>
          Articles <span v-if="!postsLoading" class="ml-1">({{ postsTotal }})</span>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item key="adresses">
          <v-container class="mt-3">
            <v-row justify="center">
              <v-col v-for="fiche in fiches" :key="fiche.id" cols="4">
                <FicheCard :fiche="fiche" height="100%"></FicheCard>
              </v-col>
              <v-col cols="12">
                <v-btn v-if="hasMoreFiches" color="primary" block text tag="a" :to="`/fiches/?search=${search}`" nuxt>
                  Vers toutes les fiches
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <v-tab-item key="articles">
          <v-container class="mt-3">
            <v-row>
              <v-col v-for="post in posts" :key="post.id" cols="6">
                <PostCard :post="post" large></PostCard>
              </v-col>
              <v-col cols="12">
                <v-btn v-if="hasMorePosts" color="primary" block text tag="a" :to="`/articles/?search=${search}`" nuxt>
                  Vers tous les articles
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </template>
    <template v-else>
      <v-container class="cq-beige">
        <template v-if="fiches.length">
          <h2 class="my-3 text-center">Les adresses ({{ fichesTotal }})</h2>
          <ReponsiveScrollGrid :items="fiches" mobile-only>
            <template #default="{ item }">
              <FicheCard :fiche="item" height="100%"></FicheCard>
            </template>
            <template #after>
              <div v-if="hasMoreFiches">
                <v-btn color="primary" height="100%" tag="a" :to="`/fiches/?search=${search}`" nuxt
                  >Voir les autres adresses</v-btn
                >
              </div>
            </template>
          </ReponsiveScrollGrid>
        </template>
        <template v-else>Aucune adresse trouvée</template>
      </v-container>
      <v-container>
        <template v-if="posts.length">
          <h2 class="my-3 text-center">Les articles ({{ postsTotal }})</h2>
          <ReponsiveScrollGrid :items="posts" mobile-only>
            <template #default="{ item }">
              <PostCard :post="item" vertical large></PostCard>
            </template>
            <template #after>
              <div v-if="hasMorePosts">
                <v-btn color="primary" height="100%" tag="a" :to="`/articles/?search=${search}`" nuxt
                  >Voir les autres articles</v-btn
                >
              </div>
            </template>
          </ReponsiveScrollGrid>
        </template>
        <template v-else>Aucun article trouvé</template>
      </v-container>
    </template>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { ficheCard as FicheCardFragments } from '~/apollo/fragments/ficheCard'
import { postCard as PostCardFragments } from '~/apollo/fragments/postCard'
import graphql from '~/mixins/graphql'
import FicheCard from '~/components/FicheCard'
import PostCard from '~/components/PostCard'
import ReponsiveScrollGrid from '~/components/ReponsiveScrollGrid'

export default {
  components: { ReponsiveScrollGrid, PostCard, FicheCard },
  mixins: [graphql],
  data() {
    return {
      search: this.$route.params.search,
      toggleSearch: false,
      tab: null,

      fiches: [],
      fichesTotal: null,
      fichesPages: null,
      fichesLoading: false,

      posts: [],
      postsTotal: null,
      postsPages: null,
      postsLoading: false,
    }
  },
  fetch() {
    this.toggleSearch = false
    const posts = this.fetchPosts()
    const fiches = this.fetchFiches()
    return Promise.all([posts, fiches])
  },
  fetchOnServer: false,
  head() {
    return {
      title: this.title,
      meta: [{ name: 'robots', content: 'noindex', hid: 'robots' }],
    }
  },
  computed: {
    totalResultCount() {
      return this.fichesTotal + this.postsTotal
    },
    hasMoreFiches() {
      return this.fichesTotal > this.fiches.length
    },
    hasMorePosts() {
      return this.postsTotal > this.posts.length
    },
    title() {
      return `${this.totalResultCount} résultats pour "${this.search}"`
    },
  },
  methods: {
    update() {
      history.pushState(null, null, `/search/${this.search}`)
      this.$fetch()
    },
    async fetchFiches() {
      try {
        this.fichesLoading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query ($text: String!, $page: Int!) {
              fichesByText(text: $text, page: $page) {
                fiches {
                  ...FicheCardFragments
                }
                hasMore
                total
                totalPages
              }
            }
            ${FicheCardFragments}
          `,
          variables: {
            text: this.search,
            page: 1,
          },
        })
        const { fiches, total, totalPages } = data.fichesByText
        this.fiches = fiches
        this.fichesTotal = total
        this.fichesPages = totalPages
      } catch (e) {
        this.$sentry.captureException(e)
        this.$nuxt.error({ statusCode: 500, message: this.parseGQLError(e) })
      } finally {
        this.fichesLoading = false
      }
    },
    async fetchPosts() {
      try {
        this.postsLoading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query ($text: String!, $page: Int!) {
              postsByText(text: $text, page: $page) {
                postCards {
                  ...PostCardFragments
                }
                hasMore
                total
                totalPages
              }
            }
            ${PostCardFragments}
          `,
          variables: {
            text: this.search,
            page: 1,
          },
        })
        const { postCards, total, totalPages } = data.postsByText
        this.posts = postCards
        this.postsTotal = total
        this.postsPages = totalPages
      } catch (e) {
        this.$sentry.captureException(e)
        this.$nuxt.error({ statusCode: 500, message: this.parseGQLError(e) })
      } finally {
        this.postsLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
