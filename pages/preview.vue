<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <Page v-if="pageType === 'page'" :page="page" preview />
    <Post v-else-if="pageType === 'post'" :post="post" preview />
    <div v-else-if="pageType === 'fiche'" class="container layout-content mx-auto mt-5">
      <Fiche :fiche="fiche" preview />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Page from '~/components/Page'
import Post from '~/components/Post'
import Fiche from '~/components/Fiche'

export default {
  components: {
    Page,
    Post,
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
  computed: {
    ...mapState(['wordpressUrl']),
  },
  async created() {
    // first try as a page
    if (!this.$route.query.type || !this.$route.query.id || !this.$route.query.nonce) {
      this.$nuxt.error({ statusCode: 400, message: 'type, id or nonce params is missing' })
      return
    }

    if (this.$route.query.type === 'page') {
      const page = await this.$axios.$get(`${this.wordpressUrl}/wp-json/wp/v2/pages/${this.$route.query.id}`, {
        withCredentials: true,
        headers: { 'X-WP-Nonce': this.$route.query.nonce },
      })
      // convert to expected page object
      page.title = this.$options.filters.heDecode(page.title.rendered)
      page.content = this.$options.filters.heDecode(page.content.rendered)

      this.page = page
      this.pageType = 'page'
    } else if (this.$route.query.type === 'post') {
      const post = await this.$axios.$get(`${this.wordpressUrl}/wp-json/wp/v2/posts/${this.$route.query.id}`, {
        params: { _embed: 1 },
        withCredentials: true,
        headers: { 'X-WP-Nonce': this.$route.query.nonce },
      })
      // convert to expected page object
      post.title = this.$options.filters.heDecode(post.title.rendered)
      post.content = this.$options.filters.heDecode(post.content.rendered)
      post.authors = post._embedded.author

      this.post = post
      this.pageType = 'post'
    } else if (this.$route.query.type === 'fiche') {
      const fiche = await this.$axios.$get(`${this.wordpressUrl}/wp-json/wp/v2/fiches/${this.$route.query.id}`, {
        params: { _embed: 1 },
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
