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
      <b-overlay :show="!fiches && !posts" opacity="0.6" blur="none" spinner-variant="yellow" class="flex-grow-1">
        <template #overlay>
          <div class="text-center">
            <h2 class="mb-3">On cherche pour toi... <i class="fas fa-binoculars"></i></h2>
            <b-spinner variant="yellow" label="chargement" />
          </div>
        </template>

        <template>
          <div class="search-results container-fluid">
            <div v-if="fiches || posts" class="text-center mt-4">
              <h1>{{ totalResultCount }} résultat(s) pour "{{ search }}"</h1>
              <div v-if="tooManyResultats">
                C'est beaucoup ! <a v-b-modal.searchModal href="" @click.prevent>Affine ta recherche</a>
              </div>
            </div>
            <div class="my-md-4">
              <div v-if="fiches && fiches.length" v-show="!showPosts">
                <div class="d-flex flex-wrap justify-content-around">
                  <Fiche v-for="fiche in fiches" :key="fiche.id" :fiche="fiche" class="m-3" />
                </div>
                <button
                  v-if="hasMoreFiches"
                  class="btn btn-outline-secondary d-block my-3 mx-auto w-50"
                  :disabled="fichesLoading"
                  @click.prevent="fetchMoreFiches"
                >
                  <b-spinner v-show="fichesLoading" small variant="grey" label="chargement" class="mr-1"></b-spinner>
                  Plus de résultats
                </button>
              </div>
              <div v-if="posts && posts.length" v-show="showPosts">
                <div class="d-flex flex-wrap justify-content-around">
                  <nuxt-link v-for="post in posts" :key="post.id" :to="{ path: `/${post.slug}` }" class="m-3">
                    <PostCard :post="post" class="mx-auto" />
                  </nuxt-link>
                </div>
                <button
                  v-if="hasMorePosts"
                  class="btn btn-outline-secondary d-block my-3 mx-auto w-50"
                  :disabled="postsLoading"
                  @click.prevent="fetchMorePosts"
                >
                  <b-spinner v-show="postsLoading" small variant="grey" label="chargement" class="mr-1"></b-spinner>
                  Plus de résultats
                </button>
              </div>

              <ToggleButtons
                v-show="posts || fiches"
                :btn1disabled="!fichesTotal"
                :btn2disabled="!postsTotal"
                @btn1action="showPosts = false"
                @btn2action="showPosts = true"
              >
                <template #button1>
                  <span class="mx-1"><i class="far fa-file-alt"></i></span>
                  Fiches<span v-if="fichesTotal" class="d-none d-md-inline"> ({{ fichesTotal }})</span>
                </template>
                <template #button2>
                  <span class="mr-1"><i class="far fa-newspaper"></i></span>
                  Articles<span v-if="postsTotal" class="d-none d-md-inline"> ({{ postsTotal }})</span>
                </template>
              </ToggleButtons>

              <ScrollTop />
            </div>
          </div>
        </template>
      </b-overlay>
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
import ToggleButtons from '~/components/ToggleButtons'
import ScrollTop from '~/components/ScrollTop'

export default {
  components: { Newsletter, PostCard, Fiche, Search, ToggleButtons, ScrollTop },
  directives: { swiper: SwiperDirective },
  data() {
    return {
      search: this.$route.params.search,

      fiches: null,
      fichesSwiperOptions: null,
      fichesVirtualData: {
        slides: [],
      },
      fichesTotal: null,
      fichesPages: null,
      fichesNextPage: 2,
      fichesLoading: false,

      posts: null,
      postsSwiperOptions: null,
      postsVirtualData: {
        slides: [],
      },
      postsTotal: null,
      postsPages: null,
      postsNextPage: 2,
      postsLoading: false,

      showPosts: false,
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
      return this.fichesNextPage <= this.fichesPages
    },
    hasMorePosts() {
      return this.postsNextPage <= this.postsPages
    },
  },
  watch: {
    showPosts() {
      this.$scrollTo(window)
    },
  },
  mounted() {
    this.$store.dispatch('posts/fetchByText', { search: this.search }).then((postResult) => {
      this.posts = postResult.posts
      this.postsTotal = postResult.total
      this.postsPages = postResult.pages
    })

    this.$store.dispatch('fiches/fetchByText', { search: this.search }).then((ficheResult) => {
      this.fiches = ficheResult.fiches
      this.fichesTotal = ficheResult.total
      this.fichesPages = ficheResult.pages
    })
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
        const newFiches = await this.$store.dispatch('fiches/fetchByText', {
          search: this.search,
          page: this.fichesNextPage++,
        })
        this.fiches.push(...newFiches.fiches)
      } finally {
        this.fichesLoading = false
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
        const newPosts = await this.$store.dispatch('posts/fetchByText', {
          search: this.search,
          page: this.postsNextPage++,
        })
        this.posts.push(...newPosts.posts)
      } finally {
        this.postsLoading = false
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
