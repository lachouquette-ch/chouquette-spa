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
  components: { LayoutAlert, LayoutHeader, LayoutFooter, LayoutHeaderCovid }
}
</script>

<style lang="scss">
@import '~assets/css/main';
@import '~assets/css/_navbar';
@import '~assets/css/_fonts';
</style>
