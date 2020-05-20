<template>
  <div>
    <WpPage v-if="pageType === 'page'" :page="page" />
    <WpPost v-else-if="pageType === 'post'" :post="post" :fiches="fiches" preview />
  </div>
</template>

<script>
import WpPost from '~/components/WpPost'
import WpPage from '~/components/WpPage'

export default {
  components: {
    WpPage,
    WpPost
  },
  data() {
    return {
      pageType: null,
      page: null,
      post: null,
      fiches: []
    }
  },
  async created() {
    // first try as a page
    if (!this.$route.query.type || !this.$route.query.id || !this.$route.query.nonce) {
      this.$nuxt.error({ statusCode: 400, message: 'type, id or nonce params is missing' })
      return
    }

    if (this.$route.query.type === 'post') {
      this.post = await this.$wpAPI.wp.posts
        .getPreview(this.$route.query.id, this.$route.query.nonce)
        .then(({ data }) => data)
      this.fiches = await this.$store.dispatch('fiches/fetchByIds', this.post.meta.link_fiche)
      this.pageType = 'post'
    } else if (this.$route.query.type === 'page') {
      this.page = await this.$wpAPI.wp.pages
        .getById(this.$route.query.id, {}, this.$route.query.nonce)
        .then(({ data }) => data)
    } else {
      this.$nuxt.error({ statusCode: 404, message: 'Could not preview this type of content' })
    }
  }
}
</script>

<style scoped></style>
