<template>
  <div>
    <LayoutHeaderCovid>
      Page spéciale COVID-19
    </LayoutHeaderCovid>
    <LayoutHeader></LayoutHeader>
    <nuxt />
  </div>
</template>

<script>
import LayoutHeaderCovid from '../components/LayoutHeaderCovid'
import LayoutHeader from '../components/LayoutHeader'

export default {
  components: { LayoutHeader, LayoutHeaderCovid }
}
</script>

<style lang="scss">
@import '~assets/css/main';
@import '~assets/css/_navbar';
@import '~assets/css/_fonts';
</style>
