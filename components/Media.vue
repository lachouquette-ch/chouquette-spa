<!--
  - Copyright (c) 2023.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-img :src="mediaDetails.url" :alt="media.alt" v-bind="{ ...$props, ...$attrs }">
    <slot></slot>
  </v-img>
</template>

<script>
import _ from 'lodash'

const THUMBNAIL_SIZES = ['thumbnail', 'medium', 'medium_large', 'large']

export default {
  props: {
    media: {
      required: true,
      type: Object,
    },
    size: {
      type: String,
      default: 'large',
      validator(value) {
        // The value must match one of thumbnail sizes https://developer.wordpress.org/reference/functions/the_post_thumbnail/
        return THUMBNAIL_SIZES.includes(value)
      },
    },
    noSrcSet: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mediaDetails: null,
    }
  },
  computed: {
    srcSet() {
      if (this.noSrcSet) return ''
      else {
        return this.media.sizes
          .map(({ image }) => {
            return `${image.url} ${image.width}w`
          })
          .join(', ')
      }
    },
  },
  watch: {
    media() {
      this.init()
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const sizes = {}
      for (const { name, image } of this.media.sizes) {
        sizes[name] = image
      }
      // find which image sizes matches the target size or an bigger size. Else fallback to full size
      const wantedSizeOrHigher = THUMBNAIL_SIZES.slice(THUMBNAIL_SIZES.indexOf(this.size))
      const selectedSizes = _.intersection(wantedSizeOrHigher, Object.keys(sizes))
      if (!_.isEmpty(selectedSizes)) this.mediaDetails = sizes[selectedSizes.shift()]
      else this.mediaDetails = sizes.full
    },
  },
}
</script>

<style scoped></style>
