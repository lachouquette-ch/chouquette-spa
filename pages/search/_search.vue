<template>
  <div>
    <b-modal
      id="searchModal"
      body-class="p-3"
      centered
      hide-footer
      title="J'affine ma recherche"
      title-class="mx-auto"
      hide-header-close
      @shown="initSearch"
    >
      <Search ref="searchBox" button-class="w-100" filter-col="col-12" />
    </b-modal>
    <div class="layout-content d-flex flex-column">
      <div class="text-center mt-5 mb-2">
        <template v-if="$fetchState.pending">
          <h2>On cherche pour toi... <i class="fas fa-binoculars"></i></h2>
        </template>
        <template v-else-if="fiches || posts">
          <h1>{{ totalResultCount }} résultat(s) pour "{{ search }}"</h1>
          <div v-if="tooManyResultats">
            C'est beaucoup ! <a v-b-modal.searchModal href="" @click.prevent>Affine ta recherche</a>
          </div>
        </template>
        <template v-else>
          <h2>On a rien trouvé, désolé...</h2>
        </template>
      </div>

      <div class="search-results container-fluid">
        <div class="my-md-4">
          <div v-show="!postsShown">
            <div class="d-flex flex-wrap justify-content-around">
              <template v-if="!!fiches.length">
                <Fiche
                  v-for="(fiche, i) in fiches"
                  :key="fiche.id"
                  v-observe-visibility="i === fiches.length - 1 ? lazyLoadFiches : false"
                  :fiche="fiche"
                  class="m-3"
                />
              </template>
              <template v-if="$fetchState.pending || fichesLoading">
                <FichePlaceholder v-for="f in 4" :key="f" class="m-3" />
              </template>
            </div>
          </div>
          <div v-show="postsShown">
            <div class="d-flex flex-wrap justify-content-around">
              <template v-if="!!posts.length">
                <nuxt-link
                  v-for="(post, i) in posts"
                  :key="post.id"
                  v-observe-visibility="i === posts.length - 1 ? lazyLoadPosts : false"
                  :to="{ path: `/${post.slug}` }"
                  class="m-3"
                >
                  <PostCard :post="post" class="mx-auto" />
                </nuxt-link>
              </template>
              <template v-if="$fetchState.pending || postsLoading">
                <PostCardPlaceholder v-for="p in 4" :key="p" class="m-3" />
              </template>
            </div>
          </div>

          <b-button-group v-show="!$fetchState.pending" size="sm" class="toggle-content-btn">
            <b-button variant="primary" :pressed="!postsShown" :disabled="!fiches.length" @click="postsShown = false">
              <span class="mx-1"><i class="far fa-file-alt"></i></span>
              Fiches<span v-if="fichesTotal" class="d-none d-md-inline"> ({{ fichesTotal }})</span>
            </b-button>
            <b-button variant="primary" :pressed="postsShown" :disabled="!posts.length" @click="postsShown = true">
              <span class="mr-1"><i class="far fa-newspaper"></i></span>
              Articles<span v-if="postsTotal" class="d-none d-md-inline"> ({{ postsTotal }})</span>
            </b-button>
          </b-button-group>

          <ScrollTop />
        </div>
      </div>

      <Newsletter />
    </div>
  </div>
</template>

<script>
import { directive as SwiperDirective } from 'vue-awesome-swiper'
import Fiche from '~/components/Fiche'
import PostCard from '~/components/PostCard'
import Search from '~/components/Search'
import Newsletter from '~/components/Newsletter'
import ScrollTop from '~/components/ScrollTop'
import FichePlaceholder from '~/components/FichePlaceholder'
import PostCardPlaceholder from '~/components/PostCardPlaceholder'

export default {
  components: { Newsletter, PostCard, Fiche, Search, ScrollTop, FichePlaceholder, PostCardPlaceholder },
  directives: { swiper: SwiperDirective },
  async fetch() {
    await Promise.all([this.fetchMorePosts(), this.fetchMoreFiches()])
    // change showPosts value if none
    this.postsShown = !this.fiches.length
  },
  fetchOnServer: false,
  data() {
    return {
      search: this.$route.params.search,

      fiches: [],
      fichesTotal: null,
      fichesPages: null,
      fichesNextPage: 1,
      fichesLoading: false,

      posts: [],
      postsTotal: null,
      postsPages: null,
      postsNextPage: 1,
      postsLoading: false,

      postsShown: false,
    }
  },
  computed: {
    totalResultCount() {
      return this.fichesTotal + this.postsTotal
    },
    tooManyResultats() {
      return this.totalResultCount > 50
    },
    hasMoreFiches() {
      return !this.fichesPages || this.fichesNextPage <= this.fichesPages
    },
    hasMorePosts() {
      return !this.postsPages || this.postsNextPage <= this.postsPages
    },
  },
  watch: {
    postsShown() {
      this.$scrollTo(window)
    },
  },
  methods: {
    async fetchMoreFiches() {
      // stop if last page
      if (!this.hasMoreFiches) {
        // eslint-disable-next-line no-console
        console.warn('no more pages for fiches')
        return
      }

      try {
        this.fichesLoading = true
        const ficheResult = await this.$store.dispatch('fiches/fetchByText', {
          search: this.search,
          page: this.fichesNextPage++,
        })
        this.fiches.push(...ficheResult.fiches)
        this.fichesTotal = ficheResult.total
        this.fichesPages = ficheResult.pages
      } finally {
        this.fichesLoading = false
      }
    },
    lazyLoadFiches(isVisible) {
      if (isVisible) {
        if (this.hasMoreFiches) {
          this.fetchMoreFiches()
        }
      }
    },
    async fetchMorePosts() {
      // stop if last page
      if (!this.hasMorePosts) {
        // eslint-disable-next-line no-console
        console.warn('no more pages for posts')
        return
      }

      try {
        this.postsLoading = true
        const postResult = await this.$store.dispatch('posts/fetchByText', {
          search: this.search,
          page: this.postsNextPage++,
        })
        this.posts.push(...postResult.posts)
        this.postsTotal = postResult.total
        this.postsPages = postResult.pages
      } finally {
        this.postsLoading = false
      }
    },
    lazyLoadPosts(isVisible) {
      if (isVisible) {
        if (this.hasMorePosts) {
          this.fetchMorePosts()
        }
      }
    },
    initSearch() {
      this.$refs.searchBox.formSearch.searchText = this.search
      this.$refs.searchBox.$refs.textFilter.focus()
    },
  },
}
</script>

<style lang="scss" scoped>
.search-results {
  min-height: 50vh;
}

.swiper-button-prev,
.swiper-button-next {
  top: 250px;
}
</style>
