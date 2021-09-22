<template>
  <div>
    <v-overlay :value="selectedFicheCard">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <FicheDialog v-model="selectedFicheCard" @close="selectedFicheCard = null"></FicheDialog>

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
      <v-card-text>
        <CqContentFolding>
          <section class="gutenberg-content" v-html="post.content"></section>
        </CqContentFolding>

        <section v-if="ficheCards">
          <v-divider class="my-3"></v-divider>
          <h2>Adresses associées</h2>
          <div class="mt-3">
            <v-list>
              <v-list-item v-for="fiche in ficheCards" :key="fiche.id" two-line @click="selectedFicheCard = fiche">
                <v-list-item-avatar size="60" horizontal>
                  <WpMediaNew :media="fiche.image" size="thumbnail"></WpMediaNew>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ fiche.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="fiche.isChouquettise" class="my-1">
                    <v-chip color="cq-yellow" text-color="primary" x-small>
                      Testé et Chouquettisé
                      <v-icon right>mdi-check</v-icon>
                    </v-chip></v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    ><span v-if="fiche.locationId">{{ getLocationById(fiche.locationId).name }} / </span>
                    {{ getCategoryById(fiche.principalCategoryId).name }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </section>

        <section v-if="comments" class="comments">
          <v-divider class="my-3"></v-divider>
          <h2>{{ comments.length }} commentaire(s)</h2>
          <p v-if="!comments.length" class="mt-2">Aucun commentaire pour le moment. N'hésite pas à donner ton avis !</p>
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
            <v-btn outlined block class="my-3" @click="showReply = !showReply"> Un nouveau commentaire ? </v-btn>
            <PostCommentReply v-if="showReply" :post="post.id" />
          </div>
        </section>

        <section v-if="similarPosts">
          <v-divider class="my-3"></v-divider>
          <h2>Articles similaires</h2>
          <div class="cq-scroll-x-container mt-3">
            <PostCard
              v-for="post in similarPosts"
              :key="post.id"
              :post="post"
              class="flex-shrink-0"
              vertical
            ></PostCard>
          </div>
        </section>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import {ficheCard as FicheCardFragments} from '@/apollo/fragments/ficheCard'
import {comment as CommentFragments} from '@/apollo/fragments/comment'
import {postCard as PostCardFragments} from '@/apollo/fragments/postCard'
import isbot from 'isbot'
import {mapGetters} from 'vuex'
import seo from '~/mixins/seo'
import gutenberg from '~/mixins/gutenberg'

import graphql from '~/mixins/graphql'
import WpMediaNew from '~/components/WpMediaNew'
import PostComment from '~/components/PostComment'
import PostCommentReply from '~/components/PostCommentReply'
import PostCard from '~/components/PostCard'
import CqContentFolding from '~/components/CqContentFolding'
import FicheDialog from '~/components/FicheDialog'

export default {
  components: {
    FicheDialog,
    CqContentFolding,
    PostCard,
    WpMediaNew,
    PostComment,
    PostCommentReply,
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
      ficheCards: [],
      selectedFicheCard: null,

      extendComments: false,
      showReply: false,
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
      return this.ficheCards && this.ficheCards.length === 1
    },
    rootLevelComments() {
      const rootComments = this.comments.filter(({ parentId }) => parentId === 0)
      return this.extendComments ? rootComments : rootComments.slice(0, 1)
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
