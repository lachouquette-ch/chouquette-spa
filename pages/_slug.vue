<template>
  <article :id="post.id" class="cq-single-post">
    <div class="cq-single-post-header container p-0">
      <WPMedia :media="featuredMedia"></WPMedia>
      <div class="cq-single-post-header-meta">
        <span>par {{ author.name }}</span>
        <div>
          publié le <MomentDateTime :datetime="post.date"></MomentDateTime> (màj le
          <MomentDateTime :datetime="post.modified"></MomentDateTime>)
        </div>
        <span>
          dans
          <a v-for="category in categories" :key="category.id" :href="category.link" :title="category.name">{{
            category.name
          }}</a>
        </span>
      </div>
      <div id="share" class="cq-single-post-header-sn-share">
        Partage cet article
        <a title="Autres" class="text-primary"><i class="fas fa-share-alt-square"></i></a>
      </div>
    </div>

    <div class="cq-single-post-content container pt-4">
      <div class="cq-single-post-content-title">
        <h1 class="mr-2 mb-4">{{ post.title.rendered }}</h1>
      </div>
      <main class="cq-single-post-content-text" v-html="post.content.rendered"></main>
    </div>

    <div class="cq-single-post-author container">
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
    </div>
  </article>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import WPMedia from '../components/WPMedia'
import MomentDateTime from '../components/MomentDateTime'

export default {
  components: { WPMedia, MomentDateTime },
  async fetch({ store, params }) {
    await store.dispatch('posts/fetchPost', params.slug)
  },
  computed: {
    ...mapState('posts', ['post']),
    ...mapGetters('posts', ['featuredMedia', 'author', 'categories', 'tags'])
  },
  head() {
    // Set Meta Tags for this Page
  }
  // and more functionality to discover
}
</script>

<style scoped></style>
