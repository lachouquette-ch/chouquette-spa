<template>
  <div>
    <LayoutAlert />
    <LayoutHeaderCovid>
      Page spéciale COVID-19
    </LayoutHeaderCovid>
    <LayoutHeader />
    <nuxt />
    <LayoutFooter />
  </div>
</template>

<script>
import LayoutHeaderCovid from '../components/LayoutHeaderCovid'
import LayoutHeader from '../components/LayoutHeader'
import LayoutFooter from '../components/LayoutFooter'
import LayoutAlert from '../components/LayoutAlert'

export default {
  components: { LayoutAlert, LayoutHeader, LayoutFooter, LayoutHeaderCovid },
  middleware({ store }) {
    if (process.client) {
      store.dispatch('nuxtServerInit')
    }
  }
}
</script>

<style></style>
