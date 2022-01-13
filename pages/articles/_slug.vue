<template>
  <div class="cq-beige">
    <v-container class="cq-md-max-width">
      <h1 class="text-center">Tous les articles</h1>
      <ReponsiveScrollGrid id="categoryContainer" :items="topCategories" mobile-only>
        <template #default="{ item }">
          <CategoryButton
            :id="item.slug"
            :top-category="item"
            :selected="item === category"
            :disabled="$fetchState.pending"
            @click="
              category = item
              fetchWithFilters()
            "
          ></CategoryButton>
        </template>
      </ReponsiveScrollGrid>
      <div class="mt-2 mt-sm-5 d-flex align-stretch">
        <template v-if="!$vuetify.breakpoint.mobile">
          <v-select
            v-model="category"
            :items="topCategories"
            :disabled="$fetchState.pending"
            solo
            rounded="0"
            dense
            hide-details
            item-text="name"
            item-value="slug"
            return-object
            label="Catégorie"
            class="flex-grow-0 mr-2"
            @change="fetchWithFilters"
          ></v-select>
        </template>
        <v-text-field
          v-model="search"
          solo
          rounded="0"
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
      <div class="d-flex align-center">
        <v-subheader class="px-0 text-body-2">{{ postsTotal }} résultat(s)</v-subheader>
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
      <v-switch
        v-model="topOnly"
        label="Tops seuls"
        hide-details
        dense
        class="mt-0 mb-1"
        @change="fetchWithFilters"
      ></v-switch>
      <v-container v-if="posts.length" class="pa-0 mt-3">
        <v-row>
          <v-col v-for="post in posts" :key="post.id" cols="12" md="6">
            <PostCard :post="post" :large="!$vuetify.breakpoint.mobile"></PostCard>
          </v-col>
          <v-col cols="12">
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
              + d'adresses
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="$fetchState.pending" class="pa-0 mt-3">
        <v-row>
          <v-col v-for="i in 5" :key="i" cols="12" md="6">
            <v-skeleton-loader
              class="mb-3 rounded-lg"
              elevation="1"
              type="list-item-avatar-three-line"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
      <v-alert
        v-else-if="!hasMorePosts"
        border="bottom"
        color="primary"
        class="text-center mt-3"
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
import fetchWordpress from '~/mixins/fetch-wp'
import { PER_PAGE_NUMBER } from '~/constants/default'
import PostCard from '~/components/PostCard'
import graphql from '~/mixins/graphql'
import CategoryButton from '~/components/CategoryButton'
import ScrollTop from '~/components/ScrollTop'
import { postCard as PostCardFragments } from '~/apollo/fragments/postCard'
import ReponsiveScrollGrid from '~/components/ReponsiveScrollGrid'

export default {
  components: { CategoryButton, PostCard, ScrollTop, ReponsiveScrollGrid },
  mixins: [seo, graphql, fetchWordpress],
  asyncData({ store, query }) {
    const category = query.category ? store.getters['categories/getBySlug'](query.category) : null

    return {
      category,
      search: query.search,
      sortAsc: query.sort === 'asc',
      topOnly: Boolean(query.topOnly),
    }
  },
  data() {
    return {
      postsNextPage: 1,
      posts: [],
      postsTotal: null,
      postsPages: null,
      hasMorePosts: true,
    }
  },
  async fetch() {
    if (!this.hasMorePosts) {
      console.info("Plus d'article à te proposer")
      return
    }

    try {
      const { data } = await this.$apollo.query({
        query: gql`
          query ($category: String, $search: String, $asc: Boolean, $topOnly: Boolean, $page: Int!, $pageSize: Int!) {
            postsByFilters(
              category: $category
              search: $search
              asc: $asc
              topOnly: $topOnly
              page: $page
              pageSize: $pageSize
            ) {
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
          topOnly: this.topOnly,
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
      if (categoryButton) {
        const categoryContainer = document.getElementById('categoryContainer')
        const buttonLeftOffset = categoryButton.offsetLeft
        const maxLeftOffset = categoryContainer.scrollWidth - categoryContainer.clientWidth
        const leftOffset = buttonLeftOffset > maxLeftOffset ? maxLeftOffset : buttonLeftOffset - 50 // need to view previous
        categoryContainer.scrollLeft = leftOffset
      }
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
      if (this.topOnly) query.topOnly = this.topOnly

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
        { property: 'og:url', content: this.currentURL },
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
