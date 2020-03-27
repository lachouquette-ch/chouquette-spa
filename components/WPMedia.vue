<template>
  <img
    :width="width"
    :height="height"
    :src="url"
    class="wp-post-image"
    :alt="media.alt_text"
    :srcset="srcSet"
    sizes="(max-width: 1024px) 100vw, 1024px"
  />
</template>

<script>
export default {
  name: 'WPMedia',
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
    }
  },
  computed: {
    width() {
      return this.media.media_details.sizes[this.size].width
    },
    height() {
      return this.media.media_details.sizes[this.size].height
    },
    url() {
      return this.media.media_details.sizes[this.size].source_url
    },
    srcSet() {
      return Object.entries(this.media.media_details.sizes)
        .map(([_, sizeData]) => {
          return `${sizeData.source_url} ${sizeData.width}w`
        })
        .join(', ')
    }
  }
}
</script>

<style scoped></style>
