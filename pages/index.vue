<template></template>

<script>
import gql from 'graphql-tag'
import { mapState } from 'vuex'
import { directive as SwiperDirective } from 'vue-awesome-swiper'

import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import { seo as SeoFragments } from '@/apollo/fragments/seo'
import WpMediaCategory from '~/components/WpMediaCategory'
import PostCard from '~/components/PostCard'
import Search from '~/components/Search'
import Newsletter from '~/components/Newsletter'
import PostCardPlaceholder from '~/components/PostCardPlaceholder'

import { AUTO_PLAY, DEFAULT, RESPONSIVE } from '~/constants/swiper'
import seo from '~/mixins/seo'
import graphql from '~/mixins/graphql'

export default {
  mixins: [seo, graphql],
  async asyncData({ app }) {
    const yoast = await app.apolloProvider.defaultClient
      .query({
        query: gql`
          query {
            home {
              seo {
                ...SeoFragments
              }
            }
          }
          ${SeoFragments}
        `,
      })
      .then(({ data }) => data.home.seo)

    return {
      yoast,
    }
  },
  data() {
    return {}
  },
  async fetch() {
    try {
      const { data } = await this.$apollo.query({
        query: gql`
          query {
            home {
              latestPosts {
                ...PostCardFragments
              }
              topPosts {
                ...PostCardFragments
              }
            }
          }
          ${PostCardFragments}
        `,
      })

      const { latestPosts, topPosts } = data.home
      this.latestPosts = latestPosts
      this.topPosts = topPosts
    } catch (e) {
      this.$sentry.captureException(e)
      this.$nuxt.error({ statusCode: 500, message: this.parseGQLError(e) })
    }
  },
  fetchOnServer: false,
  computed: {
    ...mapState({
      categories: (state) => state.menus.headerCategories,
    }),
    ...mapState(['name', 'description', 'wordpressUrl']),
  },
  head() {
    return {
      title: this.yoast.title,
      meta: [
        ...this.seoMetaProperties(JSON.parse(this.yoast.metadata), true),
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${this.wordpressUrl}/logo.png`,
        },
      ],
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.yoast.title,
          description: this.seoGetDescription(JSON.parse(this.yoast.metadata)),
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
</style>
