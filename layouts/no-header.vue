<template>
  <div>
    <LayoutAlert />
    <LayoutHeaderCovid>
      Page spéciale COVID-19
    </LayoutHeaderCovid>
    <nuxt />
    <LayoutFooter />
  </div>
</template>

<script>
import LayoutHeaderCovid from '../components/LayoutHeaderCovid'
import LayoutFooter from '../components/LayoutFooter'
import LayoutAlert from '../components/LayoutAlert'

export default {
  components: { LayoutAlert, LayoutFooter, LayoutHeaderCovid },
  middleware({ store }) {
    if (process.client) {
      store.dispatch('nuxtServerInit')
    }
  }
}
</script>

<style scoped></style>
