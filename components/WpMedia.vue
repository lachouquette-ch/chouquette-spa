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
import _ from 'lodash'

const THUMBNAIL_SIZES = ['thumbnail', 'medium', 'medium_large', 'large']

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
        return THUMBNAIL_SIZES.includes(value)
      }
    },
    noSrcSet: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    width() {
      return this.media_detail.width
    },
    height() {
      return this.media_detail.height
    },
    url() {
      return this.media_detail.source_url
    },
    srcSet() {
      return Object.entries(this.media.media_details.sizes)
        .map(([_, sizeData]) => {
          return `${sizeData.source_url} ${sizeData.width}w`
        })
        .join(', ')
    }
  },
  created() {
    // find media_detail_size that match wanted size of any upper size. Else fallback to full size
    const wantedSizeOrHigher = THUMBNAIL_SIZES.slice(THUMBNAIL_SIZES.indexOf(this.size))
    const selectedSizes = _.intersection(wantedSizeOrHigher, Object.keys(this.media.media_details.sizes))
    if (!_.isEmpty(selectedSizes)) this.media_detail = this.media.media_details.sizes[selectedSizes.shift()]
    else this.media_detail = this.media.media_details.sizes.full
  }
}
</script>

<style scoped></style>
