<template>
  <div>
    <WpPage v-if="pageType === 'page'" :page="page" preview />
    <WpPost v-else-if="pageType === 'post'" :post="post" preview />
    <div v-else-if="pageType === 'fiche'" class="container layout-content mx-auto mt-5">
      <Fiche :fiche="fiche" preview />
    </div>
  </div>
</template>

<script>
import WpPage from '~/components/WpPage'
import WpPost from '~/components/WpPost'
import Fiche from '~/components/Fiche'

export default {
  components: {
    WpPage,
    WpPost,
    Fiche,
  },
  data() {
    return {
      pageType: null,
      page: null,
      post: null,
      fiche: null,
    }
  },
  async created() {
    // first try as a page
    if (!this.$route.query.type || !this.$route.query.id || !this.$route.query.nonce) {
      this.$nuxt.error({ statusCode: 400, message: 'type, id or nonce params is missing' })
      return
    }

    if (this.$route.query.type === 'page') {
      const page = await this.$axios.$get(`${this.$config.wpBaseURL}/wp-json/wp/v2/pages/${this.$route.query.id}`, {
        withCredentials: true,
        headers: { 'X-WP-Nonce': this.$route.query.nonce },
      })
      // convert to expected page object
      page.title = this.$options.filters.heDecode(page.title.rendered)
      page.content = this.$options.filters.heDecode(page.content.rendered)

      this.page = page
      this.pageType = 'page'
    } else if (this.$route.query.type === 'post') {
      const post = await this.$axios.$get(`${this.$config.wpBaseURL}/wp-json/wp/v2/posts/${this.$route.query.id}`, {
        params: { _embed: true },
        withCredentials: true,
        headers: { 'X-WP-Nonce': this.$route.query.nonce },
      })
      // convert to expected page object
      post.title = this.$options.filters.heDecode(post.title.rendered)
      post.content = this.$options.filters.heDecode(post.content.rendered)

      this.post = post
      this.pageType = 'post'
    } else if (this.$route.query.type === 'fiche') {
      const fiche = await this.$axios.$get(`${this.$config.wpBaseURL}/wp-json/wp/v2/fiches/${this.$route.query.id}`, {
        params: { _embed: true },
        withCredentials: true,
        headers: { 'X-WP-Nonce': this.$route.query.nonce },
      })
      // convert to expected page object
      fiche.title = this.$options.filters.heDecode(fiche.title.rendered)
      fiche.content = this.$options.filters.heDecode(fiche.content.rendered)

      this.fiche = fiche
      this.pageType = 'fiche'
    } else {
      this.$nuxt.error({ statusCode: 404, message: 'Could not preview this type of content' })
    }
  },
}
</script>

<style scoped></style>
