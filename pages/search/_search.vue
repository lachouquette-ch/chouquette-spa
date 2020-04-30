<template>
  <div clasS="layout-content">
    <div class="container-fluid">
      <h1 class="text-center my-4">Résultats pour "{{ searchText }}"</h1>
      <div class="row">
        <div class="col">
          <h2 class="mb-3 text-center h3">{{ fiches.length }} fiche(s)</h2>
          <client-only>
            <swiper v-if="fiches" ref="ficheSwiper" :options="swiperOption" class="px-5">
              <swiper-slide v-for="(fiche, index) in fiches" :key="fiche.id">
                <Fiche :fiche="fiche" :responsive="false" />
              </swiper-slide>
              <div v-if="!!fiches.length" slot="pagination" class="swiper-pagination"></div>
              <div v-if="!!fiches.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
              <div v-if="!!fiches.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
            </swiper>
          </client-only>
        </div>
      </div>
      <div class="row mt-3 mb-4">
        <div class="col">
          <h2 class="mb-3 text-center h3">{{ posts.length }} articles(s)</h2>
          <client-only>
            <swiper v-if="posts" ref="postSwiper" :options="swiperOption" class="px-5">
              <swiper-slide v-for="(post, index) in posts" :key="post.id">
                <PostCard :post="post" />
              </swiper-slide>
              <div v-if="!!posts.length" slot="pagination" class="swiper-pagination"></div>
              <div v-if="!!posts.length" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
              <div v-if="!!posts.length" slot="button-next" class="swiper-button-next d-none d-md-block" />
            </swiper>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import Fiche from '~/components/Fiche'
import PostCard from '~/components/PostCard'
import { DEFAULT, RESPONSIVE } from '~/constants/swiper'

export default {
  components: { PostCard, Fiche, Swiper, SwiperSlide },
  async asyncData({ params, store, app }) {
    const [fiches, posts] = await Promise.all([
      store.dispatch('fiches/fetchByText', params.search),
      store.dispatch('posts/fetchByText', params.search)
    ])

    return {
      searchText: params.search,
      fiches,
      posts
    }
  },
  data() {
    return {
      swiperOption: { ...DEFAULT, ...RESPONSIVE }
    }
  },
  computed: {
    totalResultCount() {
      return this.fiches.length + this.posts.length
    }
  }
}
</script>

<style lang="scss" scoped></style>
