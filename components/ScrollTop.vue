<template>
  <a v-if="showLink" href="" class="scroll-top rounded-circle" @click.prevent="$scrollTo({ offset: 0 })">
    <i class="fas fa-chevron-up"></i>
  </a>
</template>

<script>
export default {
  data() {
    return {
      showLink: false,
    }
  },
  mounted() {
    const $ = require('jquery')
    $(window).on('scroll', () => {
      const height = $(window).scrollTop()
      if (height >= $(window).height() / 2) {
        this.showLink = true
      } else {
        this.showLink = false
      }
    })
  },
  beforeDestroy() {
    const $ = require('jquery')
    $(window).off('scroll')
  },
}
</script>

<style lang="scss" scoped>
.scroll-top {
  position: sticky;
  bottom: 10px;
  left: 100%;
  z-index: $zindex-fixed + 1;

  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  height: 50px;
  width: 50px;
  line-height: 50px;
  text-align: center;
  color: $chouquette-yellow;
  background-color: rgba($black, 0.5);
}
</style>
