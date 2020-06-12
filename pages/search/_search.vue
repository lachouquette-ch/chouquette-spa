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
    <div class="layout-content">
      <b-overlay :show="!fiches && !posts" opacity="0.6" blur="none" spinner-variant="yellow">
        <template #overlay>
          <div class="text-center">
            <h2 class="mb-3">On cherche pour toi... <i class="fas fa-binoculars"></i></h2>
            <b-spinner variant="yellow" label="chargement" />
          </div>
        </template>

        <template>
          <div class="search-results container-fluid">
            <div v-if="fiches || posts" class="text-center my-4">
              <h1>{{ totalResultCount }} résultat(s) pour "{{ search }}"</h1>
              <div v-if="tooManyResultats">
                C'est beaucoup ! <a v-b-modal.searchModal href="" @click.prevent>Affine ta recherche</a>
              </div>
            </div>
            <div v-if="fiches && fiches.length" class="row">
              <div class="col">
                <h2 class="text-center">{{ fichesTotal }} fiche(s)</h2>
                <b-overlay :show="fichesLoading" variant="white" opacity="1" spinner-variant="yellow">
                  <div v-if="fichesSwiperOptions" v-swiper:fichesSwiper="fichesSwiperOptions" class="swiper px-md-5">
                    <div class="swiper-wrapper mt-3">
                      <div
                        v-for="fiche in fichesVirtualData.slides"
                        :key="fiche.id"
                        class="swiper-slide h-auto d-flex align-items-stretch"
                        :style="{ left: `${fichesVirtualData.offset}px` }"
                      >
                        <Fiche :fiche="fiche" />
                      </div>
                    </div>
                    <div slot="pagination" class="swiper-pagination" />
                    <div slot="button-prev" class="swiper-button-prev d-none d-md-block" />
                    <div slot="button-next" class="swiper-button-next d-none d-md-block" />
                  </div>
                </b-overlay>
              </div>
            </div>
            <div v-if="posts && posts.length" class="row mt-5 mb-4">
              <div class="col">
                <h2 class="text-center">{{ postsTotal }} articles(s)</h2>
                <b-overlay :show="postsLoading" variant="white" opacity="1" spinner-variant="yellow">
                  <div v-if="postsSwiperOptions" v-swiper:postsSwiper="postsSwiperOptions" class="swiper px-md-5">
                    <div class="swiper-wrapper pt-3">
                      <div
                        v-for="post in postsVirtualData.slides"
                        :key="post.id"
                        class="swiper-slide h-auto d-flex align-items-stretch"
                        :style="{ left: `${postsVirtualData.offset}px` }"
                      >
                        <nuxt-link :to="{ path: `/${post.slug}` }" class="w-100">
                          <PostCard :post="post" class="mx-auto" />
                        </nuxt-link>
                      </div>
                    </div>
                    <div slot="pagination" class="swiper-pagination" />
                    <div slot="button-prev" class="swiper-button-prev d-none d-md-block" />
                    <div slot="button-next" class="swiper-button-next d-none d-md-block" />
                  </div>
                </b-overlay>
              </div>
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
import { DEFAULT, RESPONSIVE } from '~/constants/swiper'
import Newsletter from '~/components/Newsletter'

export default {
  components: { Newsletter, PostCard, Fiche, Search },
  directives: { swiper: SwiperDirective },
  data() {
    return {
      search: this.$route.params.search,

      fiches: null,
      fichesSwiperOptions: null,
      fichesVirtualData: {
        slides: []
      },
      fichesTotal: null,
      fichesPages: null,
      fichesNextPage: 2,
      fichesLoading: false,

      posts: null,
      postsSwiperOptions: null,
      postsVirtualData: {
        slides: []
      },
      postsTotal: null,
      postsPages: null,
      postsNextPage: 2,
      postsLoading: false
    }
  },
  computed: {
    totalResultCount() {
      return this.fichesTotal + this.postsTotal
    },
    tooManyResultats() {
      return this.totalResultCount > 50
    }
  },
  async mounted() {
    await new Promise((resolve) => setTimeout(resolve, 10000))

    this.$store.dispatch('posts/fetchByText', { search: this.search }).then((postResult) => {
      this.posts = postResult.posts
      this.postsTotal = postResult.total
      this.postsPages = postResult.pages

      this.postsSwiperOptions = {
        virtual: {
          slides: this.posts,
          renderExternal: (data) => {
            // assign virtual slides data
            this.postsVirtualData = data
          },
          addSlidesBefore: 2,
          addSlidesAfter: 2
        },
        ...DEFAULT,
        ...RESPONSIVE,
        on: {
          reachEnd: () => this.loadMorePosts()
        }
      }
    })

    this.$store.dispatch('fiches/fetchByText', { search: this.search }).then((ficheResult) => {
      this.fiches = ficheResult.fiches
      this.fichesTotal = ficheResult.total
      this.fichesPages = ficheResult.pages

      this.fichesSwiperOptions = {
        virtual: {
          slides: this.fiches,
          renderExternal: (data) => {
            // assign virtual slides data
            this.fichesVirtualData = data
          },
          addSlidesBefore: 2,
          addSlidesAfter: 2
        },
        ...DEFAULT,
        ...RESPONSIVE,
        on: {
          reachEnd: () => this.loadMoreFiches()
        }
      }
    })
  },
  methods: {
    async loadMorePosts() {
      // stop if last page
      if (this.postsNextPage > this.postsPages) {
        // eslint-disable-next-line no-console
        console.warn('no more pages for posts')
        return
      }

      try {
        this.postsLoading = true
        const newPosts = await this.$store.dispatch('posts/fetchByText', {
          search: this.search,
          page: this.postsNextPage++
        })
        this.posts.push(...newPosts.posts)
        this.postsSwiper.slideTo(this.postsSwiper.previousIndex + 1, 0, false)
      } finally {
        this.postsLoading = false
      }
    },
    async loadMoreFiches() {
      // stop if last page
      if (this.fichesNextPage > this.fichesPages) {
        // eslint-disable-next-line no-console
        console.warn('no more pages for fiches')
        return
      }

      try {
        this.fichesLoading = true
        const newFiches = await this.$store.dispatch('fiches/fetchByText', {
          search: this.search,
          page: this.fichesNextPage++
        })
        this.fiches.push(...newFiches.fiches)
        this.fichesSwiper.slideTo(this.fichesSwiper.previousIndex + 1, 0, false)
      } finally {
        this.fichesLoading = false
      }
    },
    initSearch() {
      this.$refs.searchBox.formSearch.searchText = this.search
      this.$refs.searchBox.$refs.textFilter.focus()
    }
  }
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
