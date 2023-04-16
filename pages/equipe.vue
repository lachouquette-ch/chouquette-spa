<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <Page :page="page" class="cq-md-max-width">
      <template #footer>
        <h2 class="text-center text-h1 mb-4">L'équipe</h2>
        <div class="d-flex flex-wrap justify-content-around mb-5">
          <v-card
            v-for="member in team"
            :key="member.id"
            rounded="lg"
            width="300"
            max-width="80vw"
            class="mx-auto mt-5"
          >
            <v-img
              :src="`${member.avatar}&s=150`"
              :alt="member.name"
              class="rounded-circle mx-auto mt-5"
              height="150"
              width="150"
            ></v-img>
            <v-card-title class="justify-center">
              <h3 class="text-header--secondary">{{ member.name }}</h3>
            </v-card-title>
            <v-card-subtitle class="text-center font-weight-bold">{{ member.title }}</v-card-subtitle>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <v-card-text class="text-center" v-html="member.description"></v-card-text>
          </v-card>
        </div>
      </template>
    </Page>
    <Newsletter></Newsletter>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { page as PageFragments } from '@/apollo/fragments/page'
import { author as AuthorParts } from '@/apollo/fragments/author'

import Page from '~/components/Page'
import seo from '~/mixins/seo'
import Newsletter from '~/components/Newsletter'

export default {
  components: {
    Newsletter,
    Page,
  },
  mixins: [seo],
  async asyncData({ app }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query {
          team {
            page {
              ...PageFragments
            }
            authors {
              ...AuthorFragments
            }
          }
        }
        ${PageFragments}
        ${AuthorParts}
      `,
    })

    return {
      page: data.team.page,
      team: data.team.authors,
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
