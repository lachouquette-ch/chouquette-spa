<template>
  <WpPage v-if="page" :page="page">
    <template #footer>
      <div class="my-3">
        <div class="d-flex flex-wrap justify-content-around">
          <div v-for="member in team" :key="member.id" class="card mr-3 mb-4">
            <img
              :alt="member.name"
              :src="`${member.avatar}&s=150`"
              class="card-img-top mx-auto mt-3 rounded-circle"
              height="150"
              width="150"
            />
            <div class="card-body text-center">
              <h3 class="card-title">{{ member.name }}</h3>
              <p class="card-text small text-muted">{{ member.title }}</p>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p class="card-text" v-html="member.description" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </WpPage>
</template>

<script>
import gql from 'graphql-tag'
import { page as PageFragments } from '@/apollo/fragments/page'
import { author as AuthorParts } from '@/apollo/fragments/author'

import { mapState } from 'vuex'
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
  computed: {
    ...mapState(['wordpressUrl']),
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
            logo: `${this.wordpressUrl}/logo.png`,
          },
          url: this.currentURL,
        }),
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.card {
  max-width: 300px;

  @include hover-focus {
    //box-shadow: $box-shadow !important;
  }
}

.card-img-top {
  width: fit-content;
}

.card-title {
  font-family: $font-family-heading;
}
</style>
