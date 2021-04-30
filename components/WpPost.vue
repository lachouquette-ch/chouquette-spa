<template>
  <div class="post-page">
    <b-modal
      id="fiche-modal"
      size="xl"
      body-bg-variant="white"
      body-text-variant="black"
      body-class="modal-body-class"
      content-class="bg-transparent border-0"
      hide-header
      hide-footer
      centered
      @hide="closeModal"
    >
      <template #default="{ close }">
        <!-- For medium device -->
        <a href="" class="fiche-modal-close d-none d-md-block m-2 text-center text-black" @click.prevent="close"
          ><i class="fas fa-times"></i
        ></a>
        <button href="" class="fiche-modal-close d-md-none btn btn-sm btn-white" @click.prevent="close">
          <span class="mr-1"><i class="fas fa-times"></i></span>
          Fermer
        </button>
        <div v-swiper:ficheSwiper="swiperFichesOptions" class="px-md-5">
          <div class="swiper-wrapper mt-3">
            <div
              v-for="fiche in fiches"
              :key="fiche.id"
              class="swiper-slide h-auto d-flex align-items-stretch"
              :data-hash="fiche.id"
            >
              <Fiche ref="fiche" class="w-100" :fiche="fiche" flat-enable />
            </div>
          </div>
          <div v-show="!hasSingleFiche" slot="pagination" class="swiper-pagination"></div>
          <div v-show="!hasSingleFiche" slot="button-prev" class="swiper-button-prev d-none d-md-block" />
          <div v-show="!hasSingleFiche" slot="button-next" class="swiper-button-next d-none d-md-block" />
        </div>
      </template>
    </b-modal>

    <nav
      v-if="fiches.length"
      class="post-sidebar bg-white pb-5 pb-md-2 border-right border-grey"
      :class="{ 'hide-sidebar': hideSidebar, 'pt-md-5': isTops }"
    >
      <div>
        <div class="post-sidebar-header d-none d-md-block text-center mb-4">
          <h2 class="post-sidebar-title h5 m-0 mt-3">
            {{ hasSingleFiche ? "La fiche de l'article" : 'Les fiches citées dans cet article' }} :
          </h2>
        </div>
        <div class="d-md-none text-center my-2">
          <b-button variant="primary" size="sm" :pressed="mapShown" @click="showMap">
            <span class="mr-1"><i class="fas fa-map-marked-alt"></i></span> Voir sur la carte
          </b-button>
        </div>
        <div>
          <Fiche v-if="hasSingleFiche" :fiche="fiches[0]" class="mx-2" />
          <FicheThumbnail
            v-for="fiche in fiches"
            v-else
            :key="fiche.id"
            :fiche="fiche"
            class="my-2 mx-3 mx-md-2 position-relative"
            @click.native="viewFiche(fiche.id)"
          />
        </div>
      </div>
    </nav>

    <main role="main" class="post layout-content" :class="{ 'with-sidebar': fiches.length }">
      <article :id="post.id">
        <header class="post-header container-fluid px-0 mb-6">
          <WPMedia v-if="post.image" :media="post.image" class="post-header-img" />
          <WpAvatar
            :size="150"
            :avatar-urls="post.author.avatar"
            :alt="post.author.name"
            class="post-header-author-img rounded-circle"
          />
          <div class="post-header-meta">
            <span>par {{ post.author.name }}</span>
            <span v-if="postModifiedDate">
              mise à jour le <time :datetime="post.modified">{{ postModifiedDate }}</time>
            </span>
            <span v-else>
              publié le <time :datetime="post.date">{{ postCreatedDate }}</time>
            </span>
          </div>
          <PostShare :post="post" class="post-header-sn-share" />
        </header>

        <section class="gutenberg-content container pt-4 mb-5">
          <h1 class="pt-2 mb-4 text-center">{{ post.title }}</h1>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="post.content" />
        </section>

        <section class="post-author container mb-5">
          <div class="border shadow-sm text-center position-relative">
            <WpAvatar
              :size="150"
              :avatar-urls="post.author.avatar"
              :alt="post.author.name"
              class="post-header-author-img rounded-circle"
            />
            <h5 class="mt-3 mb-4">{{ post.author.name }}</h5>
            <p class="px-2 pb-1">{{ post.author.description }}</p>
          </div>
        </section>

        <Newsletter />

        <section v-if="similarPosts" class="post-similar container my-5">
          <h3 class="mb-3 text-center">Tu vas aussi aimer...</h3>
          <div v-swiper:similarSwiper="swiperPostsOptions" class="swiper px-md-5">
            <div class="swiper-wrapper pt-3 pt-md-0">
              <div v-for="similarPost in similarPosts" :key="similarPost.id" class="swiper-slide">
                <nuxt-link :to="{ path: `/${similarPost.slug}` }">
                  <PostCard :post="similarPost" class="mx-auto" />
                </nuxt-link>
              </div>
            </div>
            <div slot="pagination" class="swiper-pagination d-block d-md-none" />
            <div slot="button-prev" class="swiper-button-prev d-none d-md-block"></div>
            <div slot="button-next" class="swiper-button-next d-none d-md-block"></div>
          </div>
        </section>

        <section v-if="comments" class="post-comments container my-5">
          <h3 v-if="comments.length" class="mb-3 text-center">{{ comments.length }} commentaire(s)</h3>
          <h3 v-else class="mb-3 text-center">Sois le premier à nous laisser un commentaire</h3>
          <ol class="comment-list p-0">
            <li v-for="comment in rootLevelComments" :key="comment.id" class="comment">
              <PostComment :post="post.id" :comment="comment" :comments="comments" />
            </li>
          </ol>
          <PostCommentReply :post="post.id" />
        </section>
      </article>
      <ScrollTop v-if="hideSidebar" />
    </main>

    <client-only>
      <FichesMap v-show="mapShown" ref="map" :fiches="fiches" @fichesMapSelection="viewFiche" />
    </client-only>

    <template v-if="fiches.length">
      <b-button-group v-if="isTops" size="sm" class="toggle-content-btn d-none d-md-inline-flex">
        <b-button variant="primary" :pressed="!mapShown" @click="mapShown = false">
          <span class="mr-1"><i class="far fa-newspaper"></i></span> Article
        </b-button>
        <b-button variant="primary" :pressed="mapShown" @click="showMap">
          <span class="mr-1"><i class="fas fa-map-marked-alt"></i></span> Carte
        </b-button>
      </b-button-group>
      <b-button-group size="sm" class="toggle-content-btn d-md-none">
        <b-button
          variant="primary"
          :pressed="hideSidebar"
          @click="
            hideSidebar = true
            mapShown = false
          "
        >
          <span class="mr-1"><i class="far fa-newspaper"></i></span> Article
        </b-button>
        <b-button variant="primary" :pressed="!hideSidebar" @click="hideSidebar = false">
          <span class="mr-1"><i class="far fa-file-alt"></i></span>
          {{ hasSingleFiche ? 'Fiche' : 'Fiches' }}
        </b-button>
      </b-button-group>
    </template>
  </div>
</template>

<script>
import moment from 'moment'

import gql from 'graphql-tag'
import { directive as SwiperDirective } from 'vue-awesome-swiper'
import { fiche as FicheFragments } from '@/apollo/fragments/fiche'
import { comment as CommentFragments } from '@/apollo/fragments/comment'
import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import WPMedia from '../components/WpMediaGQL'
import PostShare from '../components/PostShare'
import PostComment from '../components/PostComment'
import PostCard from '../components/PostCardGQL'
import WpAvatar from '../components/WpAvatar'
import PostCommentReply from '../components/PostCommentReply'
import FicheThumbnail from '../components/FicheThumbnail'
import ScrollTop from '../components/ScrollTop'
import Fiche from '../components/Fiche'
import seo from '~/mixins/seo'
import gutenberg from '~/mixins/gutenberg'

import { DEFAULT, RESPONSIVE, HASH } from '~/constants/swiper'
import Newsletter from '~/components/Newsletter'
import FichesMap from '~/components/FichesMap'

export default {
  components: {
    FichesMap,
    Newsletter,
    Fiche,
    FicheThumbnail,
    PostCommentReply,
    WpAvatar,
    PostComment,
    WPMedia,
    PostCard,
    PostShare,
    ScrollTop,
  },
  directives: { swiper: SwiperDirective },
  mixins: [gutenberg, seo],
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

      hideSidebar: true,

      swiperFichesOptions: {
        ...DEFAULT,
        ...HASH,
      },
      swiperPostsOptions: {
        ...DEFAULT,
        ...RESPONSIVE,
      },

      mapShown: false,
    }
  },
  computed: {
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
  watch: {
    '$fetchState.pending'() {
      this.initModal()
    },
  },
  async created() {
    if (!this.preview) {
      const {
        data: { postBySlug: result },
      } = await this.$apollo.query({
        query: gql`
          query($slug: String!) {
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
      this.fiches = result.fiches
      this.comments = result.comments
      this.similarPosts = result.similarPosts
    }
  },
  mounted() {
    this.initModal()

    // avoid googlemaps fullscreen to change slides underneath
    document.addEventListener(
      'fullscreenchange',
      () => {
        if (document.fullscreenElement) {
          this.$refs.ficheSwiper.$swiper.detachEvents()
        } else {
          this.$refs.ficheSwiper.$swiper.attachEvents()
        }
      },
      { passive: true }
    )
  },
  methods: {
    viewFiche(ficheId) {
      const ficheIndex = this.fiches.findIndex(({ id }) => id === ficheId)
      // start with correct fiche
      this.swiperFichesOptions.initialSlide = ficheIndex
      this.$bvModal.show('fiche-modal')
    },
    closeModal() {
      // remove hash reference (if any)
      history.replaceState(null, null, '#')
    },
    initModal() {
      // show fiche if previously selected
      const ficheId = parseInt(location.hash.substring(1))
      if (ficheId) {
        const selectedFiche = this.fiches.find(({ id }) => id === ficheId)
        if (selectedFiche) {
          this.hideSidebar = false
          this.viewFiche(selectedFiche.id)
        }
      }
    },

    showMap() {
      this.mapShown = true
      this.$nextTick(() => {
        this.$refs.map.resetMap()
      })
    },
  },
  head() {
    return {
      title: this.post.seo.title,
      link: this.gutenbergLinks(),
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
            logo: `${this.$config.baseURL}/logo.png`,
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

<style lang="scss" scoped>
::v-deep .modal-body-class {
  min-height: 50vh;
  @include media-breakpoint-down(sm) {
    padding: 0;
    background-color: transparent !important;
  }

  padding-top: 50px;

  .fiche-modal-close {
    position: absolute;
    top: 0;
    z-index: 2;

    @include media-breakpoint-down(sm) {
      top: 1rem;
      left: 50%;

      transform: translateX(-50%);
    }

    @include media-breakpoint-up(md) {
      right: 0;

      height: 40px;
      width: 40px;
      line-height: 40px;
    }
  }
}

.post-sidebar {
  position: fixed;
  top: $header-height + $header-banner-height;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: $zindex-sticky;
  overflow-y: auto;

  @include media-breakpoint-up(md) {
    width: 350px;

    -webkit-overflow-scrolling: touch;

    // style scrollbar
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba($chouquette-grey, 0.3);
      background-color: $chouquette-light-grey;
    }

    &::-webkit-scrollbar {
      width: 12px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 6px rgba($chouquette-grey, 0.3);
      background-color: $chouquette-grey;
    }
  }
}

.hide-sidebar {
  @include media-breakpoint-down(sm) {
    visibility: hidden;
  }
}

.post.with-sidebar {
  @include media-breakpoint-up(md) {
    margin-left: 350px;
  }
}

.post-header {
  position: relative;

  margin-bottom: 50px; // for author img
}

.post-header-img {
  width: 100%;
  height: auto;
}

.post-header-author-img {
  height: 110px;
  width: 110px;

  position: absolute;
  bottom: -55px;
  left: 20px;
  border: 5px solid $white;
  z-index: 100;
}

.post-header-meta {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding-left: 30+110+15px; // computed based on author img
  padding-right: 15px; // responsive right spacing

  padding-top: 2rem;
  padding-bottom: 5px;
  @include gradient-y(rgba($black, 0), rgba($black, 0.8));

  color: $white;
}

.post-header-sn-share {
  position: absolute;
  bottom: calc(-1.6rem - 15px);
  right: 10px;
}

.post-author {
  margin-top: 100px; // (half) author icon is 50px height

  > div {
    padding-top: 50px;
  }

  h5 {
    font-family: $font-family-heading;
    font-size: $h3-font-size;
  }

  div.col {
    padding-top: 35px; // corresp. to author image
  }

  img {
    width: 100px;
    height: 100px;

    position: absolute;
    top: -50px;
    left: 50%;
    margin-left: -50px;
  }
}

.post-similar {
  h3 {
    font-family: $font-family-heading;
    font-size: $h1-font-size;
  }
}

.post-comments {
  h3 {
    font-family: $font-family-heading;
    font-size: $h1-font-size;
  }

  ol {
    padding-left: 20px;
  }

  // no list bullets
  ol,
  ul {
    list-style-type: none;
  }
}
</style>
