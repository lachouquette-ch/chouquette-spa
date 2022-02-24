<template>
  <div>
    <Page :page="page" class="cq-md-max-width"></Page>
    <Newsletter></Newsletter>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { page as PageFragments } from '@/apollo/fragments/page'

import Page from '~/components/Page'
import seo from '~/mixins/seo'
import Newsletter from '~/components/Newsletter'

export default {
  components: {
    Newsletter,
    Page,
  },
  mixins: [seo],
  async asyncData({ app, store }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query ($slug: String!) {
          pageBySlug(slug: $slug) {
            ...PageFragments
          }
        }
        ${PageFragments}
      `,
      variables: {
        slug: store.state.labelPage,
      },
    })

    return {
      page: data.pageBySlug,
    }
  },
  head() {
    return {
      title: this.page.title,
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.page.title,
          description: this.page.description,
          publisher: {
            '@type': 'Organization',
            name: 'La Chouquette',
            logo: `${this.$config.siteUrl}/logo.png`,
          },
          url: this.currentURL,
        }),
      ],
    }
  },
}
</script>
