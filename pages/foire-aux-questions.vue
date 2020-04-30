<template>
  <WpPage :page="page" />
</template>

<script>
import WpPage from '~/components/WpPage'
export default {
  components: { WpPage },
  async asyncData({ app }) {
    return {
      page: await app.$wpAPI.wp.pages.getBySlug('foire-aux-questions').then(({ data }) => data[0])
    }
  }
}
</script>

<style scoped></style>
