<template>
  <div>
    <v-dialog
      ref="postDialog"
      v-model="postDialog"
      color="white"
      fullscreen
      scrollable
      transition="slide-x-reverse-transition"
    >
      <v-card tile>
        <v-card-title>
          <FicheShare :fiche="selectedPost" small outlined color="white--text grey darken-3">Partager</FicheShare>
          <v-spacer></v-spacer>
          <v-btn icon @click="clearFicheSelection">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-2 pb-0">
          <Fiche v-if="selectedPost" :fiche="selectedPost"></Fiche>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-container>
      <h1 class="text-h5 text-center mt-3">Tous les articles</h1>
      <div id="categoryContainer" class="cq-scroll-x-container mt-4 justfiy-start">
        <CategoryButton
          v-for="topCategory in topCategories"
          :id="topCategory.slug"
          :key="topCategory.id"
          :top-category="topCategory"
          :selected="topCategory === category"
          :disabled="$fetchState.pending"
          @click="
            category = topCategory
            fetchWithFilters()
          "
        ></CategoryButton>
      </div>
      <div class="mt-1 d-inline-flex align-stretch" style="width: 100%">
        <v-text-field
          v-model="search"
          outlined
          label="Rechercher dans les articles"
          prepend-inner-icon="mdi-magnify"
          color="grey darken-3"
          class="mr-2"
          clearable
          hide-details
          dense
          @change="searchByText"
          @click:clear.capture="clearSearch"
        ></v-text-field>
      </div>
      <template v-if="posts.length">
        <div class="d-flex align-center">
          <v-subheader class="px-0 text-body-2">{{ postsTotal }} résultats</v-subheader>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on">
                Trier
                <v-icon v-if="sortAsc" right>mdi-chevron-up</v-icon>
                <v-icon v-else right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-container class="white">
              <v-radio-group v-model="sortAsc" class="mt-0" hide-details @change="fetchWithFilters">
                <v-radio label="Les plus récents" :value="false" color="grey"></v-radio>
                <v-radio label="Les plus anciens" :value="true" color="grey"></v-radio>
              </v-radio-group>
            </v-container>
          </v-menu>
        </div>
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :loading="selectedPostCard === post"
          :post="post"
          class="mb-3"
          large
          @click="selectPost(post)"
        ></PostCard>
        <v-btn
          v-if="!$fetchState.pending && hasMorePosts"
          v-intersect.quiet="$fetch"
          color="secondary"
          :loading="$fetchState.pending"
          block
          tag="a"
          rel="next"
          outlined
          @click="$fetch"
        >
          Plus d'adresses
        </v-btn>
      </template>
      <div v-if="$fetchState.pending" class="mt-3">
        <v-skeleton-loader
          v-for="i in 5"
          :key="i"
          class="mb-3"
          elevation="1"
          type="list-item-avatar-three-line"
        ></v-skeleton-loader>
      </div>
      <v-alert
        v-else-if="!hasMorePosts"
        border="bottom"
        color="secondary lighten-3"
        class="mt-3 mb-0 text-center"
        elevation="2"
        colored-border
      >
        <span v-if="posts.length">Tu as tout vu !</span>
        <span v-else>Aucun résultat pour ta recherche</span>
      </v-alert>
      <ScrollTop></ScrollTop>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import gql from 'graphql-tag'
import seo from '~/mixins/seo'
import { PER_PAGE_NUMBER } from '~/constants/default'
import PostCard from '~/components/PostCard'
import graphql from '~/mixins/graphql'
import CategoryButton from '~/components/CategoryButton'
import ScrollTop from '~/components/ScrollTop'
import { postCard as PostCardFragments } from '~/apollo/fragments/postCard'

export default {
  components: { CategoryButton, PostCard, ScrollTop },
  mixins: [seo, graphql],
  asyncData({ store, params, query }) {
    const category = query.category ? store.getters['categories/getBySlug'](query.category) : null

    return {
      category,
      search: query.search,
      sortAsc: query.sort === 'asc',
    }
  },
  data() {
    return {
      postsNextPage: 1,
      posts: [],
      postsTotal: null,
      postsPages: null,
      hasMorePosts: true,
      selectedPostCard: null,
      selectedPost: null,
      postDialog: false,
    }
  },
  async fetch() {
    if (!this.hasMorePosts) {
      console.info("Plus d'articles disponibles")
      return
    }

    try {
      const { data } = await this.$apollo.query({
        query: gql`
          query ($category: String, $search: String, $asc: Boolean, $page: Int!, $pageSize: Int!) {
            postsByFilters(category: $category, search: $search, asc: $asc, page: $page, pageSize: $pageSize) {
              hasMore
              total
              totalPages
              postCards {
                ...PostCardFragments
              }
            }
          }
          ${PostCardFragments}
        `,
        variables: {
          category: this.category ? this.category.slug : null,
          search: this.search,
          asc: this.sortAsc,
          page: this.postsNextPage++,
          pageSize: PER_PAGE_NUMBER,
        },
      })

      const { postCards, total, totalPages, hasMore } = data.postsByFilters
      this.posts.push(...postCards)
      this.postsTotal = total
      this.postsPages = totalPages
      this.hasMorePosts = hasMore
    } catch (e) {
      this.$sentry.captureException(e)
      this.$nuxt.error({ statusCode: 500, message: this.parseGQLError(e) })
    }
  },
  mounted() {
    // initialize categories
    if (this.category) {
      // move to selected category
      const categoryButton = document.getElementById(this.category.slug)
      const categoryContainer = document.getElementById('categoryContainer')
      const buttonLeftOffset = categoryButton.offsetLeft
      const maxLeftOffset = categoryContainer.scrollWidth - categoryContainer.clientWidth
      const leftOffset = buttonLeftOffset > maxLeftOffset ? maxLeftOffset : buttonLeftOffset - 50 // need to view previous
      categoryContainer.scrollLeft = leftOffset
    }
  },
  methods: {
    fetchWithFilters() {
      this.postsNextPage = 1
      this.hasMorePosts = true
      this.posts = []

      const query = {}
      if (this.category) query.category = this.category.slug
      if (this.search) query.search = this.search
      if (this.sortAsc) query.sort = 'asc'

      this.$router.replace({ query })
      return this.$fetch()
    },
    searchByText() {
      if (this.search != null) this.fetchWithFilters()
    },
    clearSearch() {
      this.search = null
      this.fetchWithFilters()
    },
    selectPost(ficheCard) {
      // this.selectedPostCard = ficheCard
      // this.selectedPost = await this.$apollo
      //   .query({
      //     query: gql`
      //       query ($slug: String!) {
      //         ficheBySlug(slug: $slug) {
      //           ...FicheFragments
      //
      //           postCards {
      //             ...PostCardFragments
      //           }
      //
      //           similarFiches {
      //             ...FicheCardFragments
      //           }
      //         }
      //       }
      //       ${FicheFragments}
      //       ${PostCardFragments}
      //       ${FicheCardFragments}
      //     `,
      //     variables: { slug: ficheCard.slug },
      //   })
      //   .then(({ data }) => data.ficheBySlug)
      // this.postDialog = true
    },
    clearFicheSelection() {
      this.selectedPostCard = null
      this.postDialog = false
    },
  },
  computed: {
    ...mapState('categories', { topCategories: 'topLevels' }),
    ...mapGetters('categories', {
      getCategoryById: 'getById',
    }),
  },
  head() {
    const title = this.category ? this.category.name : 'Articles'
    const content = this.category
      ? this.$options.filters.heDecode(this.category.description || this.category.name)
      : 'Tous les articles'

    return {
      title,
      meta: this.seoMetaProperties([
        {
          name: 'description',
          content,
        },

        { property: 'og:type', content: 'article' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:url', content: location.href },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content,
        },
        { property: 'og:image', content: '' },

        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: title },
        {
          name: 'twitter:description',
          content,
        },
        { name: 'twitter:image', content: '' },
      ]),
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: title,
          description: content,
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

<style scoped lang="scss">
.top-category-btn {
  width: 200px;
  border: 1px solid grey;

  &:disabled,
  &button[disabled] {
    opacity: 0.6;
  }
}

.fiche-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
