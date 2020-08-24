<template>
  <WpPage :page="page">
    <template #footer>
      <h2 class="text-center my-3">Le kit du bon confineur</h2>
      <div class="post-card-shuffler d-flex flex-wrap align-items-center justify-content-center">
        <template v-if="$fetchState.pending">
          <PostCardPlaceholder v-for="p in 4" :key="p" class="post-card" />
        </template>
        <nuxt-link v-for="post in posts" v-else :key="post.id" :to="{ path: `/${post.slug}` }" class="post-card">
          <PostCard :post="post" class="mx-auto" />
        </nuxt-link>
      </div>
    </template>
  </WpPage>
</template>

<script>
import WpPage from '~/components/WpPage'
import PostCard from '~/components/PostCard'
import PostCardPlaceholder from '~/components/PostCardPlaceholder'

export default {
  components: {
    WpPage,
    PostCard,
    PostCardPlaceholder,
  },
  async fetch() {
    this.posts = await this.$store.dispatch('posts/fetchByTagSlug', { slug: 'covid-19' })
  },
  async asyncData({ app }) {
    const page = await app.$wpAPI.wp.pages.getBySlug('covid-19').then(({ data }) => data[0])

    return {
      page,
    }
  },
  data() {
    return {
      posts: [],
    }
  },
}
</script>

<style lang="scss" scoped>
.card {
  max-width: 300px;

  @include hover-focus {
    box-shadow: $box-shadow !important;
  }
}

.card-img-top {
  width: fit-content;
}

.card-title {
  font-family: $font-family-heading;
}
</style>
