<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <PostCard v-for="post in posts" :key="post.id" :post="post" class="swiper-slide" @init="update(post)" />
    </div>
    <div class="swiper-button-next swiper-button-black"></div>
    <div class="swiper-button-prev swiper-button-black"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import PostCard from './PostCard'

export default {
  components: { PostCard },
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      initedPostCount: 0
    }
  },
  mounted() {
    this.swiper = new Swiper(this.$el, {
      init: false,
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      // Responsive breakpoints (based on bootstrap breakpoints)
      breakpointsInverse: true,
      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 10
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 30
        }
      }
    })

    this.$once('hook:beforeDestroy', function() {
      this.swiper.destroy()
    })
  },
  methods: {
    update(element) {
      this.initedPostCount++
      if (this.initedPostCount === this.posts.length) {
        this.swiper.init()
        this.$emit('init')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper-button-black {
  color: $black;
}
</style>
