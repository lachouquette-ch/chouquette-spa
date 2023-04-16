<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

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
