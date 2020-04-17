<template>
  <div class="post-page">
    <b-modal
      id="fiche-modal"
      size="xl"
      header-bg-variant="white"
      header-text-variant="black"
      body-bg-variant="white"
      body-text-variant="black"
      body-class="modal-body-class"
      title-class="w-100 text-center"
      hide-footer
      centered
      @shown="$refs.fiche.resizeFiche()"
    >
      <template v-slot:modal-title>{{ fiche.title.rendered | heDecode }}</template>
      <template v-slot:default>
        <div
          class="swiper-button-prev swiper-button-yellow"
          role="button"
          aria-label="Prochaine fiche"
          @click.prevent="previousFiche(fiche)"
        ></div>
        <Fiche ref="fiche" :fiche="fiche" />
        <div
          class="swiper-button-next swiper-button-yellow"
          role="button"
          aria-label="Prochaine fiche"
          @click.prevent="nextFiche(fiche)"
        ></div>
      </template>
    </b-modal>
    <nav
      v-if="fiches"
      class="post-sidebar layout-content bg-darker-grey"
      :class="{ 'hide-sidebar': hideSidebar }"
    >
      <div class="post-sidebar-header d-none d-md-block text-center p-2">
        <h2 class="post-sidebar-title h5 m-0 text-white">Cités dans l'article :</h2>
      </div>
      <div>
        <FicheThumbnail
          v-for="fiche in fiches"
          :key="fiche.id"
          :fiche="fiche"
          class="my-2 mx-3 mx-md-2 position-relative"
          @click.native="viewFiche(fiche)"
        />
      </div>
    </nav>
    <div class="post-sidebar-toggle-buttons d-md-none btn-group btn-group-toggle" data-toggle="buttons">
      <label class="btn btn-sm btn-primary" :class="{ active: hideSidebar }" @click="hideSidebar = true">
        <input id="option1" type="radio" name="options" checked />Article
      </label>
      <label class="btn btn-sm btn-primary" :class="{ active: !hideSidebar }" @click="hideSidebar = false">
        <input id="option2" type="radio" name="options" />Fiches
      </label>
    </div>
    <b-overlay :show="!post" spinner-variant="yellow">
      <main role="main" class="post layout-content px-md-4" :class="{ 'with-sidebar': fiches }">
        <article v-if="post" :id="post.id">
          <header class="post-header container p-0 mb-6">
            <WPMedia v-if="featuredMedia" :media="featuredMedia" class="post-header-img" />
            <WpAvatar
              :size="150"
              :avatar-urls="authorAvatar"
              :alt="author.name"
              class="post-header-author-img rounded-circle"
            />
            <div class="post-header-meta">
              <span>par {{ author.name }}</span>
              <span>
                publié le <time :datetime="post.date">{{ postCreatedDate }}</time> (màj le
                <time :datetime="post.modified">{{ postModifiedDate }}</time
                >)
              </span>
              <span>
                dans
                <span v-for="(category, index) in categories" :key="category.id">
                  <a :href="category.link" :title="category.name">{{ category.name }}</a>
                  <span v-if="index != categories.length - 1">, </span>
                </span>
              </span>
            </div>
            <PostShare :post="post" class="post-header-sn-share" />
          </header>

          <section class="post-content container mb-5">
            <div class="post-content-title">
              <h1 class="mr-2 mb-4">{{ post.title.rendered | heDecode }}</h1>
            </div>
            <main class="post-content-text" v-html="post.content.rendered" />
          </section>

          <section class="post-author container my-5">
            <div class="border shadow-sm text-center position-relative">
              <WpAvatar
                :size="150"
                :avatar-urls="authorAvatar"
                :alt="author.name"
                class="post-header-author-img rounded-circle"
              />
              <h5 class="mt-3 mb-4">{{ author.name }}</h5>
              <p class="px-2 pb-1">{{ author.description }}</p>
            </div>
          </section>

          <section v-show="similarPosts" class="cq-single-post-similar container my-5">
            <h3 class="mb-3 text-center">Tu vas aussi aimer...</h3>
            <PostCardSwiper v-if="similarPosts" :posts="similarPosts" />
          </section>

          <section class="post-comments container my-5">
            <h3 class="mb-3 text-center">{{ comments.length }} commentaire(s)</h3>
            <ol class="comment-list p-0">
              <li v-for="comment in rootLevelComments" :key="comment.id" class="comment">
                <PostComment :post="post.id" :comment="comment" :comments="comments" />
              </li>
            </ol>
            <h3 class="my-4 text-center">Laisse-nous un petit mot</h3>
            <PostCommentReply :post="post.id" />
          </section>
        </article>
      </main>
    </b-overlay>
  </div>
</template>

<script>
import moment from 'moment'

import WPMedia from '../components/WpMedia'
import PostCardSwiper from '../components/PostCardSwiper'
import PostShare from '../components/PostShare'
import PostComment from '../components/PostComment'
import WpAvatar from '../components/WpAvatar'
import PostCommentReply from '../components/PostCommentReply'
import FicheThumbnail from '../components/FicheThumbnail'
import Fiche from '../components/Fiche'

export default {
  components: { Fiche, FicheThumbnail, PostCommentReply, WpAvatar, PostComment, WPMedia, PostCardSwiper, PostShare },
  data() {
    return {
      hideSidebar: true,

      post: null,
      fiche: null,
      featuredMedia: null,
      author: null,
      tags: [],
      authorAvatar: null,
      categories: [],
      similarPosts: null,
      comments: [],
      rootLevelComments: [],
      fiches: null
    }
  },
  computed: {
    postCreatedDate() {
      return moment(this.post.date).format('DD/MM/YY')
    },
    postModifiedDate() {
      return moment(this.post.date).format('DD/MM/YY')
    }
  },
  async created() {
    this.post = await this.$wpAPI.wp.posts.getBySlug(this.$route.params.slug)

    // helper fields
    this.featuredMedia = this.post._embedded['wp:featuredmedia'][0]
    this.author = this.post._embedded.author[0]
    this.tags = this.post._embedded['wp:term'][1]
    this.authorAvatar = this.author.avatar_urls

    this.comments = await this.$wpAPI.wp.comments.getByPost(this.post.id)
    this.rootLevelComments = this.comments.filter(({ parent }) => parent === 0)

    this.categories = await this.$store.dispatch('categories/fetchByIds', this.post.top_categories)

    // fetch similar posts
    this.similarPosts = await this.$wpAPI.wp.posts.get('/', {
      params: {
        tags: this.post.tags,
        exclude: this.post.id,
        per_page: 6
      }
    })

    // fetch linked fiches
    this.fiches = await this.$wpAPI.wp.fiches.getByIds(this.post.meta.link_fiche)
  },
  methods: {
    viewFiche(fiche) {
      this.fiche = fiche
      this.$bvModal.show('fiche-modal')
    },
    previousFiche(fiche) {
      let ficheIndex = this.fiches.findIndex(({ id }) => fiche.id === id)
      const previousFicheIndex = --ficheIndex < 0 ? this.fiches.length - 1 : ficheIndex
      this.fiche = this.fiches[previousFicheIndex]
    },
    nextFiche(fiche) {
      let ficheIndex = this.fiches.findIndex(({ id }) => fiche.id === id)
      const nextFicheIndex = ++ficheIndex >= this.fiches.length ? 0 : ficheIndex
      this.fiche = this.fiches[nextFicheIndex]
    }
  },
  head() {
    return {
      link: [{ rel: 'stylesheet', href: `${process.env.wpBaseUrl}/wp-includes/css/dist/block-library/style.min.css` }]
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .modal-body-class {
  min-height: 50vh;
}

.post-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: $zindex-sticky;
  overflow-y: auto;

  @include media-breakpoint-up(md) {
    width: 300px;
    border-right: 5px solid $chouquette-yellow;

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

  @include media-breakpoint-down(sm) {
    padding-bottom: 40px;
  }
}

.hide-sidebar {
  @include media-breakpoint-down(sm) {
    visibility: hidden;
  }
}

.post-sidebar-toggle-buttons {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: $zindex-sticky + 1;
}

.post {
  .with-sidebar {
    @include media-breakpoint-up(md) {
      margin-left: 300px;
    }
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
  bottom: calc(-2rem - 15px);
  right: 0;
}

.post-content-title {
  h1 {
    font-family: $font-family-heading;
  }
}

// NEW STYLE (using only gutenberg without formating in backoffice)

::v-deep .post-content-text {
  a {
    color: $chouquette-grey;

    @include hover-focus-active() {
      color: $chouquette-dark-grey;
    }
  }

  .wp-block-image {
    margin: 1.5rem auto;

    figure.aligncenter > figcaption {
      display: block;
    }
  }
}

// OLD STYLE (previous posts trying to format in backoffice)

::v-deep .post-content-text {
  /* Customs */

  text-align: justify;
  text-justify: inter-word;
  word-break: break-word;

  /* Defaults */

  h3,
  h4 {
    margin-top: 2rem;
  }

  pre {
    @extend .alert !optional;
    @extend .alert-secondary !optional;
  }

  /* Alignements */

  .aligncenter:not(.wp-block-gallery) {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .alignright:not(.wp-block-gallery) {
    float: right;
  }

  .alignleft:not(.wp-block-gallery) {
    float: left;
  }

  /* Figures */

  figure {
    text-align: center;
    max-width: 100%;
    margin: auto;

    figcaption {
      margin-top: 0.5rem;
      font-style: italic;
    }
  }

  figure.alignleft {
    margin-right: 15px;
  }

  figure.alignright {
    margin-left: 15px;
  }

  /* Images */

  img {
    max-width: 100%;
    height: auto;
  }

  img.alignright {
    padding: 4px;
    margin: 0 0 2px 7px;
    display: inline;
  }

  img.alignleft {
    padding: 4px;
    margin: 0 7px 2px 0;
    display: inline;
  }

  /* iFrame */

  iframe {
    min-width: auto !important;
    max-width: 100% !important;
  }

  /* Gallery */

  .gallery .gallery-item {
    float: left;
    text-align: center;
    width: 33%;
  }

  .gallery-columns-2 .gallery-item {
    width: 50%;
  }

  .gallery-columns-4 .gallery-item {
    width: 25%;
  }

  .gallery img {
    padding: 8px;
  }

  .gallery-columns-2 .attachment-medium {
    max-width: 92%;
    height: auto;
  }

  .gallery-columns-4 .attachment-thumbnail {
    max-width: 84%;
    height: auto;
  }

  .gallery .gallery-caption {
    font-style: italic;
  }
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

  .swiper-wrapper {
    @extend .py-3, .px-1 !optional;
  }

  .swiper-slide {
    .article-card {
      width: calc(100% - 10px);
    }

    .article-card:hover {
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.7);
    }
  }
}

::v-deep .post-comments {
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
