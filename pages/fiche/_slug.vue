<template>
  <div class="fiche-page layout-content container my-4">
    <h1 class="text-center mb-4">{{ fiche.title.rendered | heDecode }}</h1>
    <main role="main">
      <Fiche :fiche="fiche" no-ref-link flat-enable />
    </main>
    <div v-if="posts" class="mt-4">
      <h2 class="text-center mb-4">Les articles</h2>
      <div class="post-card-shuffler d-flex flex-wrap align-items-center justify-content-center">
        <nuxt-link v-for="post in posts" :key="post.id" :to="{ path: `/${post.slug}` }" class="post-card">
          <PostCard :post="post" class="mx-auto" />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import Fiche from '~/components/Fiche'
import PostCard from '~/components/PostCard'
import seo from '~/mixins/seo'

export default {
  components: { Fiche, PostCard },
  mixins: [seo],
  async asyncData({ store, params }) {
    const fiche = await store.dispatch('fiches/fetchBySlug', params.slug)

    return {
      fiche,
    }
  },
  data() {
    return {
      fiche: null,
      posts: [],
    }
  },
  async created() {
    const postIds = this.fiche.linked_posts.map(({ id }) => id)

    this.posts = await this.$store.dispatch('posts/fetchByIds', postIds)
  },
  head() {
    return {
      title: this.$options.filters.heDecode(this.fiche.title.rendered),
      meta: this.yoastMetaProperties(this.fiche.yoast_meta),
    }
  },
}
</script>

<style lang="scss" scoped>
.fiche-page {
  h1 {
    font-family: $font-family-heading;
  }
}
</style>
