<template>
  <WpPage :page="page">
    <template #footer>
      <h2 class="text-center my-3">Le kit du bon confineur</h2>
      <div v-if="posts" class="post-card-shuffler d-flex flex-wrap align-items-center justify-content-center">
        <nuxt-link v-for="post in posts" :key="post.id" :to="{ path: `/${post.slug}` }" class="post-card">
          <PostCard :post="post" class="mx-auto" />
        </nuxt-link>
      </div>
    </template>
  </WpPage>
</template>

<script>
import WpPage from '~/components/WpPage'
import PostCard from '~/components/PostCard'

export default {
  components: {
    WpPage,
    PostCard
  },
  async asyncData({ app, store }) {
    const [page, posts] = await Promise.all([
      app.$wpAPI.wp.pages.getBySlug('covid-19').then(({ data }) => data[0]),
      store.dispatch('posts/fetchByTagSlug', { slug: 'covid-19' })
    ])

    return {
      page,
      posts
    }
  }
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
