<template>
  <WpMedia v-if="media" :media="media" size="thumbnail" :no-src-set="true" width="30" height="30"></WpMedia>
</template>

<script>
import WpMedia from './WpMedia'

export default {
  components: { WpMedia },
  props: {
    category: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      required: true,
      validator(value) {
        // as defined in ACF for Category
        return ['white', 'yellow', 'black'].includes(value)
      }
    }
  },
  data: () => {
    return {
      media: null
    }
  },
  created() {
    const mediaId = this.category.logos[`logo_${this.color}`]
    this.media = this.$store.state.media.all[mediaId]
    this.$emit('init')
  }
}
</script>

<style scoped></style>
