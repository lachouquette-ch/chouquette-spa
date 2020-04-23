<template>
  <WpPage :page="page" />
</template>

<script>
import WpPage from '~/components/WpPage'
export default {
  components: { WpPage },
  async asyncData({ app }) {
    return {
      page: await app.$wpAPI.wp.pages.getBySlug('mentions-legales')
    }
  }
}
</script>

<style></style>
