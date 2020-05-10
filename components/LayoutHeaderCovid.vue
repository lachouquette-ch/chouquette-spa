<template>
  <div class="header-covid fixed-top p-3 text-center" role="alert">
    <span class="mr-2">
      <slot></slot>
    </span>
    <nuxt-link to="/covid-19" class="btn btn-primary">Clique ici !</nuxt-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.header-covid {
  height: $covid-banner-height;
  background-color: $black;
  color: $chouquette-yellow;
  font-size: $font-size-lg;
  z-index: $zindex-fixed + 2;
}
</style>
