<template>
  <div id="share">
    <template v-if="shareApiAvailable">
      Partage cet article
      <a
        class="text-primary"
        title="Autres"
        @click.prevent="shareWith('Article de la Chouquette', escapedTitle, currentPage)"
        ><i class="fas fa-share-alt-square"></i
      ></a>
    </template>
    <template v-else>
      Partage sur
      <a
        style="color: #4267b2"
        title="Facebook"
        target="_blank"
        :href="`https://www.facebook.com/sharer/sharer.php?u=${currentPage}`"
        ><i class="fab fa-facebook-square"></i
      ></a>
      <a
        style="color: #38A1F3"
        title="Twitter"
        target="_blank"
        :href="`https://twitter.com/share?text=${escapedTitle}&url=${encodeURI(currentPage)}`"
        ><i class="fab fa-twitter-square"></i
      ></a>
      <a style="color: #25d366" title="Whatsapp" target="_blank" :href="`https://wa.me/?text=${encodeURI(currentPage)}`"
        ><i class="fab fa-whatsapp-square"></i
      ></a>
      <a
        style="color: #b7b7b7"
        title="Email"
        :href="`mailto:?subject=${escapedTitle}&amp;body=Je te partage cet article ${currentPage}`"
        ><i class="fas fa-envelope-square"></i
      ></a>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      shareApiAvailable: false,
      currentPage: ''
    }
  },
  computed: {
    escapedTitle() {
      return this.$options.filters.heDecode(this.post.title.rendered)
    }
  },
  mounted() {
    this.shareApiAvailable = typeof navigator.share === 'function'
    this.currentPage = window.location.href
  },
  methods: {
    shareWith(title, text, url) {
      return navigator.share({ title, text, url })
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  font-size: 2rem;
  margin: 0 3px;
}
</style>
