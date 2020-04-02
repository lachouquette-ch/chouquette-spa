<template>
  <article :id="post.id">
    <div class="post-header container p-0">
      <WPMedia :media="featuredMedia" class="post-header-img"></WPMedia>
      <img
        :alt="author.name"
        :src="authorAvatar"
        srcset="https://lachouquette.ch/wp-content/wphb-cache/gravatar/c48/c481bcfd3703afe5904b58370a618101x300.jpg 2x"
        class="post-header-author-img rounded-circle"
        height="150"
        width="150"
      />
      <div class="post-header-meta">
        <span>par {{ author.name }}</span>
        <span>
          publié le <AppDateTime :datetime="post.date"></AppDateTime> (màj le
          <AppDateTime :datetime="post.modified"></AppDateTime>)
        </span>
        <span>
          dans
          <a v-for="category in categories" :key="category.id" :href="category.link" :title="category.name"
            >{{ category.name }}
          </a>
        </span>
      </div>
      <div id="share" class="post-header-sn-share">
        Partage cet article
        <a title="Autres" class="text-primary"><i class="fas fa-share-alt-square"></i></a>
      </div>
    </div>

    <div class="post-content container pt-4">
      <div class="post-content-title">
        <h1 class="mr-2 mb-4">{{ post.title.rendered }}</h1>
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <main class="post-content-text" v-html="post.content.rendered"></main>
      <!-- eslint-enable -->
    </div>

    <div class="post-author container">
      <div class="border shadow-sm text-center position-relative">
        <img
          alt="Val"
          src="https://uat.lachouquette.ch/wp-content/wphb-cache/gravatar/c48/c481bcfd3703afe5904b58370a618101x150.jpg"
          srcset="
            https://uat.lachouquette.ch/wp-content/wphb-cache/gravatar/c48/c481bcfd3703afe5904b58370a618101x300.jpg 2x
          "
          class="avatar avatar-150 photo cq-single-post-header-author-img rounded-circle"
          height="150"
          width="150"
        />
        <h5 class="mt-3 mb-4">{{ author.name }}</h5>
        <p class="px-2 pb-1">{{ author.description }}</p>
      </div>
    </div>

    <div class="cq-single-post-similar container mt-5">
      <h3 class="mb-3 text-center">Tu vas aussi aimer...</h3>
      <AppSwiper>
        <PostCard v-for="similarPost in similarPosts" :key="similarPost.id" :post="similarPost" class="swiper-slide" />
      </AppSwiper>
    </div>
  </article>
</template>

<script>
import WPMedia from '../components/WpMedia'
import AppDateTime from '../components/AppDateTime'
import PostCard from '../components/PostCard'
import AppSwiper from '../components/AppSwiper'

import PostAPI from '../api/wordpress/posts'

export default {
  components: { AppDateTime, WPMedia, PostCard, AppSwiper },
  async asyncData({ params }) {
    const post = await PostAPI.getBySlug(params.slug)
    const featuredMedia = post._embedded['wp:featuredmedia'][0]
    const author = post._embedded.author[0]
    const categories = post._embedded['wp:term'][0]
    const tags = post._embedded['wp:term'][1]
    const authorAvatar = Object.entries(author.avatar_urls).pop()[1]

    const similarPosts = await PostAPI.get('/', {
      params: {
        tags: post.tags,
        exclude: post.id,
        per_page: 6
      }
    })

    return {
      post,
      featuredMedia,
      author,
      categories,
      tags,
      authorAvatar,
      similarPosts
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
::v-deep {
  a {
    color: $chouquette-grey;
    text-decoration: underline;

    @include hover-focus-active() {
      color: $chouquette-dark-grey;
    }
  }
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

  > a {
    font-size: 2rem;
    margin: 0 3px;
  }
}

.post-content-title {
  h1 {
    font-family: $font-family-heading;
  }
}

// NEW STYLE (using only gutenberg without formating in backoffice)

::v-deep .post-content-text {
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

.cq-single-post-comments {
  h3 {
    font-family: $font-family-heading;
    font-size: $h1-font-size;
  }

  a {
    @extend .link-secondary !optional;
  }

  // no list bullets
  ol,
  ul {
    list-style-type: none;
  }

  .comment-list {
    padding: 0;
  }

  .comment {
    margin-bottom: 0.5rem;
  }

  .comment-body {
    margin-bottom: 1rem;
  }

  .comment-meta {
    .comment-author {
      img {
        @extend .rounded-circle !optional;
        margin-right: 0.5rem;
      }
    }

    .comment-metadata {
      a {
        text-decoration: none;
      }
    }

    .comment-content {
      margin-top: 0.5rem;

      > p {
        margin: 0;
      }
    }
  }
}
</style>
