<template>
  <v-card>
    <WpMediaNew :media="post.image" />
    <v-card-title>{{ post.title }}</v-card-title>
    <v-card-text v-html="post.content"></v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment'

import gql from 'graphql-tag'
import { fiche as FicheFragments } from '@/apollo/fragments/fiche'
import { comment as CommentFragments } from '@/apollo/fragments/comment'
import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import { mapState } from 'vuex'
import seo from '~/mixins/seo'
import gutenberg from '~/mixins/gutenberg'

import { DEFAULT, RESPONSIVE, HASH } from '~/constants/swiper'
import graphql from '~/mixins/graphql'
import WpMediaNew from '~/components/WpMediaNew'

export default {
  components: {
    WpMediaNew,
  },
  mixins: [gutenberg, seo, graphql],
  props: {
    post: {
      type: Object,
      required: true,
    },
    preview: Boolean,
  },
  data() {
    return {
      fiches: [],

      comments: null,
      similarPosts: null,
    }
  },
  async fetch() {
    try {
      const { data } = await this.$apollo.query({
        query: gql`
          query ($slug: String!) {
            postBySlug(slug: $slug) {
              id
              fiches {
                ...FicheFragments
              }
              comments {
                ...CommentFragments
              }
              similarPosts {
                ...PostCardFragments
              }
            }
          }
          ${FicheFragments}
          ${CommentFragments}
          ${PostCardFragments}
        `,
        variables: { slug: this.post.slug },
      })

      const { postBySlug } = data
      this.fiches = postBySlug.fiches || []
      this.comments = postBySlug.comments
      this.similarPosts = postBySlug.similarPosts

      this.initModal()
    } catch (e) {
      this.$sentry.captureException(e)
      this.$store.dispatch('alerts/addAction', {
        type: 'warning',
        message: `Problème lors du chargement d'une partie de la page : ${this.parseGQLError(e)}`,
      })
    }
  },
  fetchOnServer: false,
  computed: {
    ...mapState(['wordpressUrl']),
    postCreatedDate() {
      return moment(this.post.date).format('DD/MM/YY')
    },
    postModifiedDate() {
      return moment(this.post.modified).format('DD/MM/YY')
    },
    hasSingleFiche() {
      return this.fiches && this.fiches.length === 1
    },
    rootLevelComments() {
      return this.comments.filter(({ parentId }) => parentId === 0)
    },
    isTops() {
      return !!this.post.tags.find(({ slug }) => {
        return slug === 'tops'
      })
    },
  },
  head() {
    if (this.preview) return { meta: [{ name: 'robots', content: 'none' }] }

    return {
      title: this.post.seo.title,
      link: this.gutenbergStylesheets(),
      meta: [
        ...this.seoMetaProperties(JSON.parse(this.post.seo.metadata)),
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.post.image,
        },
      ],
      script: [
        this.jsonLDScript({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: this.post.title,
          image: this.post.image,
          description: this.seoGetDescription(JSON.parse(this.post.seo.metadata)),
          author: this.post.author.name,
          publisher: {
            '@type': 'Organization',
            name: 'La Chouquette',
            logo: `${this.wordpressUrl}/logo.png`,
          },
          url: this.currentURL,
          datePublished: this.post.date,
          dateModified: this.post.modified,
        }),
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
