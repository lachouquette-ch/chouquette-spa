<template>
  <div>
    <WpPage v-if="pageType === 'page'" :page="page" />
    <WpPost v-else-if="pageType === 'post'" :post="post" />
  </div>
</template>

<script>
import _ from 'lodash'

import fetchPageBySlug from '@/apollo/queries/pageBySlug.graphql'
import WpPost from '~/components/WpPost'
import WpPage from '~/components/WpPage'

export default {
  components: {
    WpPage,
    WpPost,
  },
  async asyncData(context) {
    const { app, store, params, route, error } = context
    const client = app.apolloProvider.defaultClient

    // store initialization
    await store.dispatch('yoast/init')

    // first try as a page
    const page = await client
      .query({ query: fetchPageBySlug, variables: { slug: params.slug } })
      .then(({ data }) => data.pageBySlug)
    if (page) {
      return {
        pageType: 'page',
        page,
      }
    }

    // then as a post
    const post = await app.$wpAPI.wp.posts.getBySlug(params.slug, { _embed: true }).then(({ data }) => data[0])

    // redirect if not a post neither
    if (_.isEmpty(post)) {
      await store.dispatch('yoast/redirect', { path: route.path, context })
      error({ statusCode: '404', message: `'${params.slug}' n'existe pas` })
    }

    return {
      pageType: 'post',
      post,
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
