<template>
  <div v-if="media">
    <WpMedia :media="media" size="thumbnail" :no-src-set="true" width="30" height="30"></WpMedia>
  </div>
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
  async created() {
    const mediaId = this.category.acf.logos[`logo_${this.color}`]
    this.media = await this.$store.dispatch('media/fetchById', mediaId)
    this.$emit('init')
  }
}
</script>

<style scoped></style>
