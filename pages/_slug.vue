<template>
  <div>
    <nav v-if="fiches" class="d-none d-md-block bg-darker-grey post-sidebar">
      <div class="post-sidebar-header text-center p-2">
        <h2 class="post-sidebar-title h5 m-0 text-white">Cités dans l'article :</h2>
      </div>
      <FicheThumbnail v-for="fiche in fiches" :key="fiche.id" :fiche="fiche" class="m-2 position-relative" />
    </nav>
    <main role="main" class="px-4">
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
            <h1 class="mr-2 mb-4">{{ escapedTitle }}</h1>
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

        <section v-show="isSimilarPostsShown" class="cq-single-post-similar container my-5">
          <h3 class="mb-3 text-center">Tu vas aussi aimer...</h3>
          <PostCardSwiper v-if="similarPosts" :posts="similarPosts" @init="isSimilarPostsShown = true" />
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
  </div>
</template>

<script>
import he from 'he'
import moment from 'moment'

import PostAPI from '../api/wordpress/posts'
import CommentAPI from '../api/wordpress/comments'
import FicheAPI from '../api/wordpress/fiches'

import WPMedia from '../components/WpMedia'
import PostCardSwiper from '../components/PostCardSwiper'
import PostShare from '../components/PostShare'
import PostComment from '../components/PostComment'
import WpAvatar from '../components/WpAvatar'
import PostCommentReply from '../components/PostCommentReply'
import FicheThumbnail from '../components/FicheThumbnail'

export default {
  components: { FicheThumbnail, PostCommentReply, WpAvatar, PostComment, WPMedia, PostCardSwiper, PostShare },
  data() {
    return {
      isSimilarPostsShown: false,
      post: null,
      featuredMedia: null,
      author: null,
      tags: [],
      authorAvatar: null,
      categories: [],
      similarPosts: [],
      comments: [],
      rootLevelComments: [],
      fiches: []
    }
  },
  computed: {
    escapedTitle() {
      return he.decode(this.post.title.rendered)
    },
    postCreatedDate() {
      return moment(this.post.date).format('DD/MM/YY')
    },
    postModifiedDate() {
      return moment(this.post.date).format('DD/MM/YY')
    }
  },
  async created() {
    this.post = await PostAPI.getBySlug(this.$route.params.slug)

    // helper fields
    this.featuredMedia = this.post._embedded['wp:featuredmedia'][0]
    this.author = this.post._embedded.author[0]
    this.tags = this.post._embedded['wp:term'][1]
    this.authorAvatar = this.author.avatar_urls

    this.comments = await CommentAPI.getByPost(this.post.id)
    this.rootLevelComments = this.comments.filter(({ parent }) => parent === 0)

    this.categories = await this.$store.dispatch('categories/fetchByIds', this.post.top_categories)

    // fetch similar posts
    this.similarPosts = await PostAPI.get('/', {
      params: {
        tags: this.post.tags,
        exclude: this.post.id,
        per_page: 6
      }
    })

    // fetch linked fiches
    this.fiches = await FicheAPI.getByIds(this.post.meta.link_fiche)
  },
  head() {
    return {
      link: [{ rel: 'stylesheet', href: `${process.env.wpBaseUrl}/wp-includes/css/dist/block-library/style.min.css` }]
    }
  }
}
</script>

<style lang="scss" scoped>
main[role='main'] {
  margin-left: 300px;
}

.post-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $zindex-fixed;
  padding: $header-height + $covid-banner-height 0 0;
  width: 300px;
  border-right: 5px solid $chouquette-yellow;

  overflow-y: auto;
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

.post-sidebar-header {
  //border-top: 3px solid $white;
}

.post-sidebar-title {
  //letter-spacing: 3px;
}

.cq-single-post-fiches {
  height: calc(100vh - #{$header-height} - #{$covid-banner-height});
  width: 350px;
  background-color: $chouquette-light-grey;

  position: fixed;
  top: $header-height + $covid-banner-height;
  left: -350px + 5px; // border
  z-index: $zindex-fixed;

  border-right: 5px solid $chouquette-yellow;

  @include media-breakpoint-down(sm) {
    width: 100vw;
    left: -100vw;

    border-right: none;
  }

  button {
    border-radius: unset;
  }

  transition: left 0.5s;

  &.open {
    left: 0;
  }
}

.cq-single-post-fiches-btn {
  height: 48px;
  width: 190px;

  position: absolute;
  right: -5px; // border
  bottom: calc(50% - 95px);

  transform: rotate(90deg);
  transform-origin: bottom right;
}

.cq-single-post-fiches-btn-sm {
  height: $hidden-content-handle-btn-height;
  width: 150px;

  position: absolute;
  top: 0;
  right: 0;

  transition: right 1s;
}

.cq-single-post-fiches.open > .cq-single-post-fiches-btn-sm {
  width: 100%;

  position: relative;
  right: auto !important;
}

.cq-single-post-fiches-wrapper {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  height: calc(100vh - #{$header-height} - #{$covid-banner-height});

  @include media-breakpoint-down(md) {
    height: calc(100vh - #{$header-height} - #{$hidden-content-handle-btn-height} - #{$covid-banner-height}); // button
  }

  background-color: $white;

  article {
    margin: auto; // center articles
  }

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
