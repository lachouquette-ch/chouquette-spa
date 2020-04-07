<template>
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
          <a v-for="category in categories" :key="category.id" :href="category.link" :title="category.name"
            >{{ category.name }}
          </a>
        </span>
      </div>
      <PostShare :post="post" class="post-header-sn-share" />
    </header>

    <div class="post-content container mb-5">
      <div class="post-content-title">
        <h1 class="mr-2 mb-4">{{ escapedTitle }}</h1>
      </div>
      <main class="post-content-text" v-html="post.content.rendered" />
    </div>

    <div class="post-author container my-5">
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
    </div>

    <div v-show="isSimilarPostsShown" class="cq-single-post-similar container my-5">
      <h3 class="mb-3 text-center">Tu vas aussi aimer...</h3>
      <PostCardSwiper v-if="similarPosts" :posts="similarPosts" @init="isSimilarPostsShown = true" />
    </div>

    <div class="post-comments container my-5">
      <h3 class="mb-3 text-center">{{ comments.length }} commentaire(s)</h3>
      <ol class="comment-list">
        <li v-for="comment in rootLevelComments" :key="comment.id" class="comment">
          <PostComment :comment="comment" :comments="comments" />
        </li>
      </ol>
      <h3 class="mb-3 text-center">Laisse-nous un petit mot</h3>
      <div id="respond" class="comment-respond">
        <form class="comment-form" @submit.prevent="postComment">
          <p class="comment-notes">Ton email ne sera pas publié. Les champs obligatoires sont indiqués avec *</p>
          <div class="form-group">
            <label for="comment">Commentaire *</label>
            <textarea
              id="comment"
              v-model="formComment.comment"
              class="form-control"
              rows="5"
              aria-required="true"
              required
            ></textarea>
          </div>
          <div class="form-group row">
            <label class="col-sm-4 col-form-label" for="author">Nom *</label>
            <div class="col-sm-8">
              <input
                id="author"
                v-model="formComment.name"
                class="form-control"
                type="text"
                aria-required="true"
                required
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-4 col-form-label" for="email">Adresse de messagerie *</label>
            <div class="col-sm-8">
              <input
                id="email"
                v-model="formComment.email"
                class="form-control"
                type="email"
                aria-required="true"
                required
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-4 col-form-label" for="url">Site web</label>
            <div class="col-sm-8">
              <input
                id="url"
                v-model="formComment.webSite"
                class="form-control"
                name="url"
                type="text"
                value=""
                size="30"
              />
            </div>
          </div>
          <div class="form-submit">
            <input id="submit" type="submit" class="btn btn-primary" value="Poster mon commentaire" />
          </div>
        </form>
      </div>
    </div>
  </article>
</template>

<script>
import he from 'he'
import moment from 'moment'
import { required, email, url, minLength } from 'vuelidate/lib/validators'

import PostAPI from '../api/wordpress/posts'

import WPMedia from '../components/WpMedia'
import PostCardSwiper from '../components/PostCardSwiper'
import PostShare from '../components/PostShare'
import PostComment from '../components/PostComment'
import WpAvatar from '../components/WpAvatar'

export default {
  components: { WpAvatar, PostComment, WPMedia, PostCardSwiper, PostShare },
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
      formComment: {
        name: null,
        email: null,
        webSite: null,
        comment: null
      }
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
    this.comments = this.post._embedded.replies[0].reverse()
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
  },
  head() {
    return {
      link: [{ rel: 'stylesheet', href: `${process.env.wpBaseUrl}/wp-includes/css/dist/block-library/style.min.css` }]
    }
  }
}
</script>

<style lang="scss" scoped>
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
    text-decoration: underline;

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
