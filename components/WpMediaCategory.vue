<template>
  <WpMedia v-if="media" :media="media" size="thumbnail" :no-src-set="true" width="30" height="30"></WpMedia>
</template>

<script>
import WpMedia from './WpMedia'

// as defined in ACF for Category
const CATEGORY_LOGO_COLORS = ['white', 'yellow', 'black']
const isColorValid = (color) => CATEGORY_LOGO_COLORS.includes(color)

export default {
  components: { WpMedia },
  props: {
    category: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
      validator: isColorValid,
    },
  },
  data: () => {
    return {
      media: null,
    }
  },
  watch: {
    color(newColor) {
      if (!isColorValid) throw new TypeError(`${newColor} is not a valid color`)
      this.initMedia()
    },
  },
  created() {
    this.initMedia()
  },
  methods: {
    initMedia() {
      const mediaId = this.category.logos[`logo_${this.color}`]
      this.media = this.$store.state.media.all[mediaId]
    },
  },
}
</script>

<style scoped></style>
