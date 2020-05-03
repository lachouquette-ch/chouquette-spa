<template>
  <Index :latest-posts="latestPosts" :top-posts="topPosts" :yoast="yoast" />
</template>

<script>
import Index from '~/components/Index'

const LATEST_POSTS_NUM = 6
const TOP_POSTS_NUM = 8

export default {
  components: { Index },
  layout: 'no-header',
  async asyncData({ app, store }) {
    // fetch all
    const [latestPosts, topPosts, yoast] = await Promise.all([
      store.dispatch('posts/fetchLatests', LATEST_POSTS_NUM),
      store.dispatch('posts/fetchTops', TOP_POSTS_NUM),
      app.$wpAPI.yoast.getHome().then(({ data }) => data)
    ])

    return {
      latestPosts,
      topPosts,
      yoast
    }
  }
}
</script>

<style scoped></style>
