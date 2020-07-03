<template>
  <div>
    <WpPage v-if="pageType === 'page'" :page="page" />
    <WpPost v-else-if="pageType === 'post'" :post="post" :fiches="fiches" />
  </div>
</template>

<script>
import _ from 'lodash'

import WpPost from '~/components/WpPost'
import WpPage from '~/components/WpPage'

export default {
  components: {
    WpPage,
    WpPost,
  },
  async asyncData({ app, store, params, error }) {
    // first try as a page
    const page = await app.$wpAPI.wp.pages.getBySlug(params.slug).then(({ data }) => data[0])
    if (page) {
      return {
        pageType: 'page',
        page,
      }
    }

    // then as a post
    const post = await app.$wpAPI.wp.posts.getBySlug(params.slug, { _embed: true }).then(({ data }) => data[0])

    // quite if not a post neither
    if (_.isEmpty(post)) {
      error({ statusCode: '404', message: `'${params.slug}' n'existe pas` })
      return {}
    }

    const fiches = await store.dispatch('fiches/fetchByIds', post.meta.link_fiche)

    return {
      pageType: 'post',
      post,
      fiches,
    }
  },
  data() {
    return {
      pageType: null,
    }
  },
}
</script>

<style scoped></style>
