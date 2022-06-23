<template>
  <div>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <FichePostDialog
      v-model="ficheDialog"
      :fiche-or-post="selectedFiche"
      :fullscreen="$vuetify.breakpoint.mobile"
      max-width="500"
      replace-url
    ></FichePostDialog>

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
      <PostCommentReply :post="post.id" @close="commentDialog = false" />
    </v-dialog>

    <v-card flat tile class="mt-5">
      <div style="position: relative; margin-bottom: 35px" class="px-3 px-md-0 cq-md-max-width">
        <v-img v-if="preview" :src="post.featured_img" />
        <Media v-else :media="post.image" gradient="180deg, transparent 70%, black" class="rounded-xl" />
        <v-img
          :src="mainAuthor.avatar"
          :alt="mainAuthor.name"
          height="75"
          width="75"
          class="rounded-circle header-author"
        ></v-img>
        <div class="header-meta">par {{ mainAuthor.name }} le {{ postDate | fromISO }}</div>
      </div>
      <v-card-title class="justify-center">
        <h1 class="my-0">{{ post.title }}</h1>
      </v-card-title>
      <v-card-text class="pa-0">
        <ContentFolding class="cq-md-max-width px-3 px-md-0 pb-5">
          <section class="gutenberg-content" v-html="post.content"></section>
        </ContentFolding>

        <div v-if="!preview" class="cq-beige">
          <div class="cq-md-max-width px-3 px-md-0">
            <section v-if="ficheCards.length" class="py-5 mt-3">
              <h2 v-if="ficheCards.length > 1" class="text-header--secondary">Adresses associées</h2>
              <h2 v-else class="text-header--secondary">Adresse associée</h2>
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
                  <v-btn :block="$vuetify.breakpoint.mobile" color="cq-blue" @click="mapDialog = true"
                    ><v-icon left>mdi-map</v-icon>Afficher la carte</v-btn
                  >
                </div>
              </template>
            </section>

            <section class="comments">
              <v-divider class="mb-3"></v-divider>
              <template v-if="$fetchState.pending">
                <h2 class="text-header--secondary">Commentaires</h2>
                <v-skeleton-loader type="article"></v-skeleton-loader>
              </template>
              <template v-else>
                <h2 class="text-header--secondary">{{ comments.length }} commentaire(s)</h2>
                <p v-if="!comments.length" class="mt-2">
                  Aucun commentaire pour le moment. N'hésite pas à donner ton avis !
                </p>
                <div v-else>
                  <ol class="p-0 px-2 px-md-5">
                    <li v-for="comment in rootLevelComments" :key="comment.id" class="comment">
                      <PostComment
                        :post="post.id"
                        :comment="comment"
                        :comments="comments"
                        :no-reply="!extendComments"
                      />
                    </li>
                  </ol>
                  <div class="text-decoration-underline">
                    <v-btn v-if="!extendComments" text @click="extendComments = true">Voir tous les commentaires</v-btn>
                  </div>
                </div>
                <div>
                  <v-btn
                    color="cq-red"
                    :block="$vuetify.breakpoint.mobile"
                    class="my-3"
                    large
                    @click="commentDialog = true"
                  >
                    Un nouveau commentaire ?
                  </v-btn>
                </div>
              </template>
            </section>

            <section class="py-5">
              <v-divider class="mb-3"></v-divider>
              <h2 class="text-header--secondary">Articles similaires</h2>
              <ReponsiveScrollGrid v-if="$fetchState.pending" :items="[0, 1, 2, 3]" cols="6" md="3">
                <v-skeleton-loader type="card" width="150" class="mx-auto"></v-skeleton-loader>
              </ReponsiveScrollGrid>
              <ReponsiveScrollGrid v-else :items="similarPosts" cols="6" md="4" class="my-2">
                <template #default="{ item }">
                  <PostCard :post="item" vertical large class="mx-auto" transparent></PostCard>
                </template>
              </ReponsiveScrollGrid>
            </section>
          </div>
        </div>
        <div v-else class="cq-red--text pa-3 text-center">Pas plus d'informations en prévisualisation</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import isbot from 'isbot'
import { mapGetters } from 'vuex'
import { ficheCard as FicheCardFragments } from '@/apollo/fragments/ficheCard'
import { comment as CommentFragments } from '@/apollo/fragments/comment'
import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
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
    if (this.preview) return

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
          content: this.post.image.source,
        },
      ],
      script: [
        this.jsonLDScript({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: this.post.title,
          image: this.post.image.source,
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

h2 {
  text-align: center;
  margin: 1.5rem 0;
  font-weight: 900;
  font-family: $secondary-font-family !important;
}
</style>
