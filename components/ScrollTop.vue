<template>
  <v-fade-transition>
    <v-btn v-if="show" class="btn-top primary--text" fab small dark @click="scrollTop">
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-fade-transition>
</template>

<script>
import goTo from 'vuetify/lib/services/goto'

export default {
  data() {
    return {
      show: false,
    }
  },
  mounted() {
    const $ = require('jquery')
    $(window).on('scroll', () => {
      const height = $(window).scrollTop()
      if (height >= $(window).height() / 2) {
        this.show = true
      } else {
        this.show = false
      }
    })
  },
  beforeDestroy() {
    const $ = require('jquery')
    $(window).off('scroll')
  },
  methods: {
    scrollTop() {
      goTo(0)
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-top {
  position: fixed;
  bottom: 56px;
  margin-bottom: 10px;
  right: 10px;
  opacity: 0.7;
}
</style>
