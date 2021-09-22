<template>
  <WpPage :page="page">
    <template #footer>
      <h2 class="text-center">L'équipe</h2>
      <div class="d-flex flex-wrap justify-content-around mb-5">
        <v-card v-for="member in team" :key="member.id" rounded="lg" width="300" max-width="80vw" class="mx-auto mt-5">
          <v-img
            :src="`${member.avatar}&s=150`"
            :alt="member.name"
            class="rounded-circle mx-auto mt-5"
            height="150"
            width="150"
          ></v-img>
          <v-card-title class="justify-center">
            <h3>{{ member.name }}</h3>
          </v-card-title>
          <v-card-subtitle>{{ member.title }}</v-card-subtitle>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <v-card-text class="text-center" v-html="member.description"></v-card-text>
        </v-card>
      </div>
    </template>
  </WpPage>
</template>

<script>
import gql from 'graphql-tag'
import {page as PageFragments} from '@/apollo/fragments/page'
import {author as AuthorParts} from '@/apollo/fragments/author'

import WpPage from '~/components/WpPage'
import seo from '~/mixins/seo'

export default {
  components: {
    WpPage,
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
          url: location.href,
        }),
      ],
    }
  },
}
</script>
