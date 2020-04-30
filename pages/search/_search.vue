<template>
  <div>
    <b-modal id="searchModal" title-class="mx-auto" body-class="p-3" centered hide-footer title="J'affine ma recherche">
      <Search button-class="w-100" filter-col="col-12" />
    </b-modal>
    <div class="layout-content">
      <div class="container-fluid">
        <h1 class="text-center my-4">{{ totalResultCount }} résultats pour "{{ searchText }}"</h1>
        <div class="row">
          <div class="col">
            <div class="text-center mb-3">
              <h2 class="h3">{{ fichesTotal }} fiche(s)</h2>
              <!--              <div v-if="tooManyFiches">C'est beaucoup ! <a href="" v-b-modal.searchModal>Affine ta recherche</a></div>-->
              <div>C'est beaucoup ! <a v-b-modal.searchModal href="" @click.prevent>Affine ta recherche</a></div>
            </div>
            <client-only>
              <swiper v-if="fiches" ref="ficheSwiper" :options="swiperOption" class="px-5">
                <swiper-slide v-for="(fiche, index) in fiches" :key="fiche.id">
                  <Fiche :fiche="fiche" :responsive="false" />
                </swiper-slide>
                <div v-if="!!fiches.length" slot="pagination" class="swiper-pagination" />
                <div v-if="!!fiches.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
                <div v-if="!!fiches.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
              </swiper>
            </client-only>
          </div>
        </div>
        <div class="row mt-5 mb-4">
          <div class="col">
            <div class="text-center mb-3">
              <h2 class="mb-0">{{ postsTotal }} articles(s)</h2>
              <div v-if="tooManyPosts">C'est beaucoup ! <a href="">Affine ta recherche</a></div>
            </div>
            <client-only>
              <swiper v-if="posts" ref="postSwiper" :options="swiperOption" class="px-5">
                <swiper-slide v-for="(post, index) in posts" :key="post.id">
                  <PostCard :post="post" />
                </swiper-slide>
                <div v-if="!!posts.length" slot="pagination" class="swiper-pagination" />
                <div v-if="!!posts.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
                <div v-if="!!posts.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
              </swiper>
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import Fiche from '~/components/Fiche'
import PostCard from '~/components/PostCard'
import Search from '~/components/Search'
import { DEFAULT, RESPONSIVE } from '~/constants/swiper'

export default {
  components: { PostCard, Fiche, Swiper, SwiperSlide, Search },
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
      swiperOption: { ...DEFAULT, ...RESPONSIVE }
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
  }
}
</script>

<style lang="scss" scoped></style>
