<template>
  <div>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <FichePostDialog v-model="ficheDialog" :fiche-or-post="selectedFiche" fullscreen replace-url></FichePostDialog>

    <v-dialog v-model="mapDialog" fullscreen hide-overlay transition="dialog-top-transition">
      <v-card tile class="d-flex flex-column align-stretch">
        <v-card-title class="flex-nowrap">
          <span>Les adresses de "{{ post.title }}"</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="mapDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <div class="flex-grow-1">
          <FichesMap
            :fiches="ficheCards"
            style="position: absolute"
            :fiche-loading="loading"
            @mapSelectFiche="
              (ficheCard) => {
                selectFiche(ficheCard)
              }
            "
          ></FichesMap>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="commentDialog" max-width="500">
      <PostCommentReply :post="post.id" />
    </v-dialog>

    <v-card flat tile>
      <div style="position: relative; margin-bottom: 35px">
        <Media :media="post.image" gradient="180deg, transparent 70%, black" />
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
      <v-card-text>
        <ContentFolding>
          <section class="gutenberg-content" v-html="post.content"></section>
        </ContentFolding>

        <section>
          <v-divider class="my-3"></v-divider>
          <h2>Adresses associées</h2>
          <template v-if="$fetchState.pending">
            <v-skeleton-loader v-for="i in 3" :key="i" type="list-item-avatar" class="my-3"></v-skeleton-loader>
          </template>
          <template v-else>
            <ReponsiveScrollGrid :items="ficheCards" md="3" class="my-2">
              <template #default="{ item }">
                <FicheCard :fiche="item" height="100%" disable-link @click="selectFiche(item)"></FicheCard>
              </template>
            </ReponsiveScrollGrid>
            <div v-if="hasAnyLocation" class="text-center">
              <v-btn :block="$vuetify.breakpoint.mobile" outlined @click="mapDialog = true">Afficher la carte</v-btn>
            </div>
          </template>
        </section>

        <section class="comments">
          <v-divider class="my-3"></v-divider>
          <template v-if="$fetchState.pending">
            <h2>Commentaires</h2>
            <v-skeleton-loader type="article"></v-skeleton-loader>
          </template>
          <template v-else>
            <h2>{{ comments.length }} commentaire(s)</h2>
            <p v-if="!comments.length" class="mt-2">
              Aucun commentaire pour le moment. N'hésite pas à donner ton avis !
            </p>
            <div v-else>
              <ol class="p-0">
                <li v-for="comment in rootLevelComments" :key="comment.id" class="comment">
                  <PostComment :post="post.id" :comment="comment" :comments="comments" :no-reply="!extendComments" />
                </li>
              </ol>
              <div class="text-decoration-underline">
                <v-btn v-if="!extendComments" text @click="extendComments = true">Voir tous les commentaires</v-btn>
              </div>
            </div>
            <div>
              <v-btn outlined :block="$vuetify.breakpoint.mobile" class="my-3" @click="commentDialog = true">
                Un nouveau commentaire ?
              </v-btn>
            </div>
          </template>
        </section>

        <section>
          <v-divider class="my-3"></v-divider>
          <h2>Articles similaires</h2>
          <ReponsiveScrollGrid v-if="$fetchState.pending" :items="[0, 1, 2, 3]" md="3">
            <v-skeleton-loader type="card" width="150" class="mx-auto"></v-skeleton-loader>
          </ReponsiveScrollGrid>
          <ReponsiveScrollGrid v-else :items="similarPosts" md="4" class="my-2">
            <template #default="{ item }">
              <PostCard :post="item" vertical large class="mx-auto"></PostCard>
            </template>
          </ReponsiveScrollGrid>
        </section>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import { ficheCard as FicheCardFragments } from '@/apollo/fragments/ficheCard'
import { comment as CommentFragments } from '@/apollo/fragments/comment'
import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import isbot from 'isbot'
import { mapGetters } from 'vuex'
import seo from '~/mixins/seo'
import gutenberg from '~/mixins/gutenberg'
import fetchWordpress from '~/mixins/fetch-wp'

import FichePostDialog from '~/components/FichePostDialog'
import graphql from '~/mixins/graphql'
import Media from '~/components/Media'
import PostComment from '~/components/PostComment'
import PostCommentReply from '~/components/PostCommentReply'
import PostCard from '~/components/PostCard'
import ContentFolding from '~/components/ContentFolding'
import FichesMap from '~/components/FichesMap'
import ReponsiveScrollGrid from '~/components/ReponsiveScrollGrid'
import FicheCard from '~/components/FicheCard'

export default {
  name: 'Post',
  components: {
    FicheCard,
    FichePostDialog,
    ReponsiveScrollGrid,
    FichesMap,
    ContentFolding,
    PostCard,
    Media,
    PostComment,
    PostCommentReply,
  },
  mixins: [gutenberg, seo, graphql, fetchWordpress],
  props: {
    post: {
      type: Object,
      required: true,
    },
    preview: Boolean,
  },
  data() {
    return {
      ficheCards: [],

      mapDialog: false,

      loading: false,
      selectedFiche: null,
      ficheDialog: false,

      commentDialog: false,
      extendComments: false,
      comments: [],
      similarPosts: [],
    }
  },
  async fetch() {
    try {
      const { data } = await this.$apollo.query({
        query: gql`
          query ($slug: String!) {
            postBySlug(slug: $slug) {
              id
              ficheCards {
                ...FicheCardFragments
              }
              comments {
                ...CommentFragments
              }
              similarPosts {
                ...PostCardFragments
              }
            }
          }
          ${FicheCardFragments}
          ${CommentFragments}
          ${PostCardFragments}
        `,
        variables: { slug: this.post.slug },
      })

      const { postBySlug } = data
      this.ficheCards = postBySlug.ficheCards || []
      this.comments = postBySlug.comments
      this.similarPosts = postBySlug.similarPosts
    } catch (e) {
      this.$sentry.captureException(e)
      this.$store.dispatch('alerts/addAction', {
        type: 'warning',
        message: `Problème lors du chargement d'une partie de la page : ${this.parseGQLError(e)}`,
      })
    }
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
  watch: {
    post() {
      this.$fetch()
    },
  },
  methods: {
    async selectFiche(ficheCard) {
      try {
        this.loading = true
        this.selectedFiche = await this.fetchFicheBySlug(ficheCard.slug)
        this.ficheDialog = true
      } finally {
        this.loading = false
      }
    },
  },
  fetchOnServer: false,
  computed: {
    mainAuthor() {
      return this.post.authors[0]
    },
    postDate() {
      return this.post.modified ? this.post.modified : this.post.date
    },
    hasSingleFiche() {
      return this.ficheCards && this.ficheCards.length === 1
    },
    rootLevelComments() {
      const rootComments = this.comments.filter(({ parentId }) => parentId === 0)
      return this.extendComments ? rootComments : rootComments.slice(0, 1)
    },
    hasAnyLocation() {
      return _.some(this.ficheCards, 'poi')
    },
    ...mapGetters('categories', {
      getCategoryById: 'getById',
    }),
    ...mapGetters('locations', {
      getLocationById: 'getById',
    }),
  },
  mounted() {
    this.extendPostContent = isbot(navigator.userAgent)
    this.extendComments = isbot(navigator.userAgent)
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
  border: 5px solid white;
}

.header-meta {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding-left: 15px + 75px + 15px;
  color: white;
}

.comments {
  ol {
    padding-left: 0;
  }

  // no list bullets
  ol,
  ul {
    list-style-type: none;
  }
}
</style>
