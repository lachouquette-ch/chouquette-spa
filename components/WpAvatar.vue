<template>
  <img alt="" :src="urlSrc" :srcset="urlSrcSet" class="avatar avatar-32 photo" :height="size" :width="size" />
</template>

<script>
const AVATAR_SIZES = [24, 32, 48, 150]
const avatarUrlRegExp = new RegExp(`\\?s=\\d+`)

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
    }
  },
  created() {
    const sampleURL = Object.values(this.avatarUrls).shift()

    this.urlSrc = sampleURL.replace(avatarUrlRegExp, `?s=${this.size}`)
    this.urlSrcSet = sampleURL.replace(avatarUrlRegExp, `?s=${this.size * 2}`) + ' 2x'
  },
}
</script>

<style scoped></style>
