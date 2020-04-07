<template>
  <img alt="" :src="urlSrc" :srcset="urlSrcSet" class="avatar avatar-32 photo" :height="size" :width="size" />
</template>

<script>
const AVATAR_SIZES = [24, 32, 48, 150]

export default {
  props: {
    avatarUrls: {
      required: true,
      type: Object
    },
    size: {
      type: Number,
      default: 32,
      validator(value) {
        return AVATAR_SIZES.includes(value)
      }
    }
  },
  data() {
    return {
      urlSrc: '',
      urlSrcSet: ''
    }
  },
  created() {
    const [size, url] = Object.entries(this.avatarUrls).shift()
    const avatarUrlRegExp = new RegExp(`x${size}.jpg`)

    this.urlSrc = url.replace(avatarUrlRegExp, `x${this.size}.jpg`)
    this.urlSrcSet = url.replace(avatarUrlRegExp, `x${this.size * 2}.jpg 2x`)
  }
}
</script>

<style scoped></style>
