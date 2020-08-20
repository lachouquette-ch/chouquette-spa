<template>
  <div class="header-banner fixed-top p-3 text-center" role="alert">
    <span class="mr-2">{{ text }}</span>
    <nuxt-link v-if="isLinkRelative" :to="linkTo" class="btn btn-primary">{{ linkText }}</nuxt-link>
    <a v-else :href="linkTo" target="_blank" class="btn btn-primary">{{ linkText }}</a>
  </div>
</template>

<script>
export default {
  data() {
    const text = this.$config.bannerText || 'Page spéciale COVID-19'
    const linkTo = this.$config.bannerLinkTo || '/covid-19'
    const linkText = this.$config.bannerLinkText || 'Clique ici !'

    return {
      text,
      linkTo,
      linkText,
    }
  },
  computed: {
    isLinkRelative() {
      return !this.linkTo.startsWith('http')
    },
  },
}
</script>

<style lang="scss" scoped>
.header-banner {
  height: $header-banner-height;
  background-color: $black;
  color: $chouquette-yellow;
  font-size: $font-size-lg;
  z-index: $zindex-fixed + 2;
}
</style>
