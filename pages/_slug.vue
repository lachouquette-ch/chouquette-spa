<template>
  <div>
    <Page v-if="pageType === 'page'" :page="page" class="cq-md-max-width" />
    <template v-else-if="pageType === 'post'">
      <PostShare :post="post" class="cq-share-position" fab color="primary"></PostShare>
      <Post :post="post" />
    </template>
    <Newsletter></Newsletter>
  </div>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'

import { post as PostFragments } from '@/apollo/fragments/post'
import { page as PageFragments } from '@/apollo/fragments/page'
import Post from '~/components/Post'
import Page from '~/components/Page'
import PostShare from '~/components/PostShare'
import Newsletter from '~/components/Newsletter'

export default {
  components: {
    Newsletter,
    PostShare,
    Page,
    Post,
  },
  async asyncData(context) {
    const { app, store, params, route, error } = context
    const client = app.apolloProvider.defaultClient

    // store initialization
    await store.dispatch('nuxtServerInit')

    // first try as a post
    const post = await client
      .query({
        query: gql`
          query ($slug: String!) {
            postBySlug(slug: $slug) {
              ...PostFragments
            }
          }
          ${PostFragments}
        `,
        variables: { slug: params.slug },
      })
      .then(({ data }) => data.postBySlug)
    if (post) {
      return {
        pageType: 'post',
        post,
      }
    }

    // then as a post
    const page = await client
      .query({
        query: gql`
          query ($slug: String!) {
            pageBySlug(slug: $slug) {
              ...PageFragments
            }
          }
          ${PageFragments}
        `,
        variables: { slug: params.slug },
      })
      .then(({ data }) => data.pageBySlug)

    // redirect if not a post neither
    if (_.isEmpty(page)) {
      await store.dispatch('yoast/redirect', {
        path: route.path,
        context,
        fallback: { statusCode: 404, message: `'${params.slug}' n'existe pas` },
      })
    }

    return {
      pageType: 'page',
      page,
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
