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
      <div class="container-fluid">
        <h1 class="text-center my-4">{{ totalResultCount }} résultats pour "{{ searchText }}"</h1>
        <div class="row">
          <div class="col">
            <div class="text-center mb-3">
              <h2 class="mb-0">{{ fichesTotal }} fiche(s)</h2>
              <div v-if="tooManyFiches">
                C'est beaucoup ! <a v-b-modal.searchModal href="" @click.prevent>Affine ta recherche</a>
              </div>
            </div>
            <client-only>
              <div v-if="fiches" v-swiper:ficheSwiper="swiperOption" class="px-1 px-md-5">
                <div class="swiper-wrapper mt-3">
                  <div v-for="fiche in fiches" :key="fiche.id" class="swiper-slide">
                    <Fiche :fiche="fiche" :responsive="false" />
                  </div>
                </div>
                <div v-if="!!fiches.length" slot="pagination" class="swiper-pagination" />
                <div v-if="!!fiches.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
                <div v-if="!!fiches.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
              </div>
            </client-only>
          </div>
        </div>
        <div class="row mt-5 mb-4">
          <div class="col">
            <div class="text-center mb-3">
              <h2 class="mb-0">{{ postsTotal }} articles(s)</h2>
              <div v-if="tooManyPosts">
                C'est beaucoup ! <a v-b-modal.searchModal href="" @click.prevent>Affine ta recherche</a>
              </div>
            </div>
            <client-only>
              <div v-if="posts" v-swiper:postSwiper="swiperOption" class="px-1 px-md-5">
                <div class="swiper-wrapper mt-3">
                  <div v-for="post in posts" :key="post.id" class="swiper-slide">
                    <nuxt-link :to="{ path: `/${post.slug}` }" class="text-decoration-none">
                      <PostCard :post="post" class="mx-auto" />
                    </nuxt-link>
                  </div>
                </div>
                <div v-if="!!posts.length" slot="pagination" class="swiper-pagination" />
                <div v-if="!!posts.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
                <div v-if="!!posts.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
              </div>
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { directive as SwiperDirective } from 'vue-awesome-swiper'
import Fiche from '~/components/Fiche'
import PostCard from '~/components/PostCard'
import Search from '~/components/Search'
import { DEFAULT, RESPONSIVE } from '~/constants/swiper'

export default {
  components: { PostCard, Fiche, Search },
  directives: { swiper: SwiperDirective },
  async asyncData({ params, store, app }) {
    const [ficheResult, postResult] = await Promise.all([
      store.dispatch('fiches/fetchByText', params.search),
      store.dispatch('posts/fetchByText', params.search)
    ])

    return {
      searchText: params.search,
      fiches: ficheResult.fiches,
      fichesTotal: ficheResult.total,
      fichesPages: ficheResult.pages,
      posts: postResult.posts,
      postsTotal: postResult.total,
      postsPages: postResult.pages
    }
  },
  data() {
    return {
      swiperOption: { ...DEFAULT, ...RESPONSIVE, centeredSlides: false }
    }
  },
  computed: {
    totalResultCount() {
      return this.fichesTotal + this.postsTotal
    },
    tooManyFiches() {
      return this.fichesTotal > this.fiches.length
    },
    tooManyPosts() {
      return this.postsTotal > this.posts.length
    }
  },
  methods: {
    initSearch() {
      this.$refs.searchBox.formSearch.searchText = this.searchText
      this.$refs.searchBox.$refs.textFilter.focus()
    }
  }
}
</script>

<style scoped></style>
