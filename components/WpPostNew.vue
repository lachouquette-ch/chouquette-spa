<template>
  <v-card flat tile>
    <div style="position: relative; margin-bottom: 35px">
      <WpMediaNew :media="post.image" gradient="180deg, transparent 70%, black" />
      <v-img
        :src="mainAuthor.avatar"
        :alt="mainAuthor.name"
        height="75"
        width="75"
        class="rounded-circle header-author"
      ></v-img>
      <div class="header-meta">par {{ mainAuthor.name }} le {{ postDate | fromISO }}</div>
    </div>
    <v-card-title>
      <h1>{{ post.title }}</h1>
    </v-card-title>
    <v-card-text
      class="gutenberg-content"
      :class="{ 'post-folded': !extendPostContent }"
      v-html="post.content"
    ></v-card-text>
    <div v-if="!extendPostContent" class="text-center">
      <v-btn color="primary" class="mb-5 text-center" @click="extendPostContent = true">Lire la suite</v-btn>
    </div>
  </v-card>
</template>

<script>
import gql from 'graphql-tag'
import { fiche as FicheFragments } from '@/apollo/fragments/fiche'
import { comment as CommentFragments } from '@/apollo/fragments/comment'
import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import isbot from 'isbot'
import seo from '~/mixins/seo'
import gutenberg from '~/mixins/gutenberg'

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
      extendPostContent: false,
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
          author: this.mainAuthor.name,
          publisher: {
            '@type': 'Organization',
            name: 'La Chouquette',
            logo: `${this.$config.siteUrl}/logo.png`,
          },
          url: this.currentURL,
          datePublished: this.post.date,
          dateModified: this.post.modified,
        }),
      ],
    }
  },
  computed: {
    mainAuthor() {
      return this.post.authors[0]
    },
    postDate() {
      return this.post.modified ? this.post.modified : this.post.date
    },
    hasSingleFiche() {
      return this.fiches && this.fiches.length === 1
    },
    rootLevelComments() {
      return this.comments.filter(({ parentId }) => parentId === 0)
    },
  },
  mounted() {
    this.extendPostContent = isbot(navigator.userAgent)
  },
}
</script>

<style lang="scss" scoped>
.header-author {
  position: absolute;
  bottom: 0;
  left: 15px;
  transform: translateY(50%);
  z-index: 1;
  border: 5px solid $white;
}

.header-meta {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding-left: 15px + 75px + 15px;
  color: white;
}

.post-folded {
  position: relative;
  height: 300px;
  overflow: hidden;

  &:after {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    content: '';
    background: linear-gradient(180deg, transparent 60%, white);
    pointer-events: none;
  }
}
</style>
