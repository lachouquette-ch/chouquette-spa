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
                <client-only>
                  <b-overlay :show="fichesLoading" opacity="0.6" blur="none" spinner-variant="yellow">
                    <div v-if="fiches" v-swiper:fichesSwiper="ficheSwiperOptions" class="px-1 px-md-5">
                      <div class="swiper-wrapper mt-3">
                        <div v-for="fiche in fiches" :key="fiche.id" class="swiper-slide">
                          <Fiche :fiche="fiche" no-unfold />
                        </div>
                      </div>
                      <div v-if="!!fiches.length" slot="pagination" class="swiper-pagination" />
                      <div v-if="!!fiches.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
                      <div v-if="!!fiches.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
                    </div>
                  </b-overlay>
                </client-only>
              </div>
            </div>
            <div v-if="posts && posts.length" class="row mt-5 mb-4">
              <div class="col">
                <h2 class="text-center">{{ postsTotal }} articles(s)</h2>
                <client-only>
                  <b-overlay :show="postsLoading" opacity="0.6" blur="none" spinner-variant="yellow">
                    <div v-if="posts" v-swiper:postsSwiper="postSwiperOptions" class="px-1 px-md-5">
                      <div class="swiper-wrapper mt-3">
                        <div v-for="post in posts" :key="post.id" class="swiper-slide">
                          <nuxt-link :to="{ path: `/${post.slug}` }">
                            <PostCard :post="post" class="mx-auto" />
                          </nuxt-link>
                        </div>
                      </div>
                      <div v-if="!!posts.length" slot="pagination" class="swiper-pagination" />
                      <div v-if="!!posts.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
                      <div v-if="!!posts.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
                    </div>
                  </b-overlay>
                </client-only>
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
    const swiperOptions = {
      ...DEFAULT,
      ...RESPONSIVE
    }
    return {
      search: this.$route.params.search,

      fiches: null,
      fichesTotal: null,
      fichesPages: null,
      fichesNextPage: 2,
      fichesLoading: false,

      posts: null,
      postsTotal: null,
      postsPages: null,
      postsNextPage: 2,
      postsLoading: false,

      postSwiperOptions: {
        ...swiperOptions,
        on: {
          reachEnd: () => this.loadMorePosts()
        }
      },
      ficheSwiperOptions: {
        ...swiperOptions,
        on: {
          reachEnd: () => this.loadMoreFiches()
        }
      }
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
  async created() {
    await new Promise((resolve) => setTimeout(resolve, 10000))

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
    async loadMorePosts() {
      // stop if last page
      if (this.postsNextPage > this.postsPages) return

      try {
        this.postsLoading = true
        const newPosts = await this.$store.dispatch('posts/fetchByText', {
          search: this.search,
          page: this.postsNextPage++
        })
        this.posts.push(...newPosts.posts)
        this.postsSwiper.update()
      } finally {
        this.postsLoading = false
      }
    },
    async loadMoreFiches() {
      // stop if last page
      if (this.fichesNextPage > this.fichesPages) return

      try {
        this.fichesLoading = true
        const newFiches = await this.$store.dispatch('fiches/fetchByText', {
          search: this.search,
          page: this.fichesNextPage++
        })
        this.fiches.push(...newFiches.fiches)
        this.fichesSwiper.update()
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
</style>
