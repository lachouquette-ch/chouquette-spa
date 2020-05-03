<template>
  <WpPost :post="post" :comments="comments" :similar-posts="similarPosts" :fiches="fiches" />
</template>

<script>
import WpPost from '~/components/WpPost'
export default {
  components: {
    WpPost
  },
  async asyncData({ app, store, params }) {
    const post = await app.$wpAPI.wp.posts.getBySlug(params.slug, { _embed: true }).then(({ data }) => data[0])

    const [comments, similarPosts, fiches] = await Promise.all([
      app.$wpAPI.wp.comments.getByPost(post.id).then(({ data }) => data),
      store.dispatch('posts/fetchSimilar', post),
      store.dispatch('fiches/fetchByIds', post.meta.link_fiche)
    ])

    return {
      post,
      comments,
      similarPosts,
      fiches
    }
  }
}
</script>

<style scoped></style>
