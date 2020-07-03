<template>
  <img alt="" :src="urlSrc" :srcset="urlSrcSet" class="avatar avatar-32 photo" :height="size" :width="size" />
</template>

<script>
const AVATAR_SIZES = [24, 32, 48, 150]

export default {
  props: {
    avatarUrls: {
      required: true,
      type: Object,
    },
    size: {
      type: Number,
      default: 32,
      validator(value) {
        return AVATAR_SIZES.includes(value)
      },
    },
  },
  data() {
    return {
      urlSrc: '',
      urlSrcSet: '',
    }
  },
  created() {
    const [size, url] = Object.entries(this.avatarUrls).shift()
    const avatarUrlRegExp = new RegExp(`\\?s=${size}`)

    this.urlSrc = url.replace(avatarUrlRegExp, `?s=${this.size}`)
    this.urlSrcSet = url.replace(avatarUrlRegExp, `?s=${this.size * 2}`) + ' 2x'
  },
}
</script>

<style scoped></style>
