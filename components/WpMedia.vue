<template>
  <img
    :width="width"
    :height="height"
    :src="url"
    :alt="media.alt_text"
    :srcset="srcSet"
    sizes="(max-width: 1024px) 100vw, 1024px"
  />
</template>

<script>
export default {
  props: {
    media: {
      required: true,
      type: Object
    },
    size: {
      type: String,
      default: 'large',
      validator(value) {
        // The value must match one of thumbnail sizes https://developer.wordpress.org/reference/functions/the_post_thumbnail/
        return ['thumbnail', 'medium', 'medium_large', 'large'].includes(value)
      }
    },
    noSrcSet: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    width() {
      return this.media ? this.media.media_details.sizes[this.size].width : ''
    },
    height() {
      return this.media ? this.media.media_details.sizes[this.size].height : ''
    },
    url() {
      return this.media ? this.media.media_details.sizes[this.size].source_url : ''
    },
    srcSet() {
      if (this.noSrcSet) {
        return ''
      } else {
        return Object.entries(this.media.media_details.sizes)
          .map(([_, sizeData]) => {
            return `${sizeData.source_url} ${sizeData.width}w`
          })
          .join(', ')
      }
    }
  }
}
</script>

<style scoped></style>
