<template>
  <div class="fiche-page layout-content container my-4">
    <h1 class="text-center mb-4">{{ fiche.title.rendered | heDecode }}</h1>
    <main role="main">
      <Fiche :fiche="fiche" no-ref-link flat-enable />
    </main>
    <div class="mt-4">
      <template v-if="$fetchState.pending">
        <div class="text-center">
          <b-spinner variant="yellow" label="chargement"></b-spinner>
        </div>
      </template>
      <template v-else-if="posts.length">
        <h2 class="text-center mb-4">
          <span v-if="posts.length === 1">L'article</span>
          <span v-else>Les articles</span>
        </h2>
        <div class="post-card-shuffler d-flex flex-wrap align-items-center justify-content-center">
          <nuxt-link v-for="post in posts" :key="post.id" :to="{ path: `/${post.slug}` }" class="post-card">
            <PostCard :post="post" class="mx-auto" />
          </nuxt-link>
        </div>
      </template>
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
  async fetch() {
    const postIds = this.fiche.linked_posts.map(({ id }) => id)

    this.posts = await this.$store.dispatch('posts/fetchByIds', postIds)
  },
  async asyncData(context) {
    const { store, params, route, error } = context

    // store initialization
    await store.dispatch('yoast/init')

    const fiche = await store.dispatch('fiches/fetchBySlug', params.slug)
    if (!fiche) {
      await store.dispatch('yoast/redirect', { path: route.path, context })
      error({ statusCode: '404', message: `'${params.slug}' n'existe pas` })
    }

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
