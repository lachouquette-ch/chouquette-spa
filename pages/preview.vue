<template>
  <div>
    <WpPage v-if="pageType === 'page'" :page="page" />
    <WpPost v-else-if="pageType === 'post'" :post="post" preview />
    <div v-else-if="pageType === 'fiche'" class="container layout-content mx-auto mt-5">
      <Fiche :fiche="fiche" />
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
      this.page = await this.$wpAPI.wp.pages
        .getPreview(this.$route.query.id, this.$route.query.nonce)
        .then(({ data }) => data)
      this.pageType = 'page'
    } else if (this.$route.query.type === 'post') {
      this.post = await this.$wpAPI.wp.posts
        .getPreview(this.$route.query.id, this.$route.query.nonce)
        .then(({ data }) => data)
      this.pageType = 'post'
    } else if (this.$route.query.type === 'fiche') {
      this.fiche = await this.$wpAPI.wp.fiches
        .getPreview(this.$route.query.id, this.$route.query.nonce)
        .then(({ data }) => data)
      this.pageType = 'fiche'
    } else {
      this.$nuxt.error({ statusCode: 404, message: 'Could not preview this type of content' })
    }
  },
}
</script>

<style scoped></style>
