<template>
  <span id="share">
    <template v-if="shareApiAvailable">
      Partage cet article
      <a
        class="text-primary"
        title="Autres"
        @click.prevent="shareWith('Article de la Chouquette', escapedTitle, fichePage)"
        ><i class="fas fa-share-alt-square"></i
      ></a>
    </template>
    <template v-else>
      <b-dropdown size="sm" dropup text="A partager sur" variant="outline-secondary">
        <b-dropdown-item
          :href="`https://www.facebook.com/sharer/sharer.php?u=${fichePage}`"
          target="_blank"
          variant="secondary"
          link-class="text-decoration-none"
        >
          <span style="color: #4267b2" class="mr-2"><i class="fab fa-facebook-square"></i></span> Facebook
        </b-dropdown-item>
        <b-dropdown-item
          :href="`https://twitter.com/share?text=${escapedTitle}&url=${encodeURI(fichePage)}`"
          target="_blank"
          variant="secondary"
          link-class="text-decoration-none"
        >
          <span style="color: #38A1F3" class="mr-2"><i class="fab fa-twitter-square"></i></span> Twitter
        </b-dropdown-item>
        <b-dropdown-item
          :href="`https://wa.me/?text=${encodeURI(fichePage)}`"
          target="_blank"
          variant="secondary"
          link-class="text-decoration-none"
        >
          <span style="color: #25d366" class="mr-2"><i class="fab fa-whatsapp-square"></i></span> Whatsapp
        </b-dropdown-item>
        <b-dropdown-item
          :href="`mailto:?subject=${escapedTitle}&amp;body=Je te partage cet article ${fichePage}`"
          variant="secondary"
          link-class="text-decoration-none"
        >
          <span style="color: #b7b7b7" class="mr-2"><i class="fas fa-envelope-square"></i></span> Email
        </b-dropdown-item>
      </b-dropdown>
    </template>
  </span>
</template>

<script>
export default {
  props: {
    fiche: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      shareApiAvailable: false,
    }
  },
  computed: {
    escapedTitle() {
      return this.$options.filters.heDecode(this.fiche.title.rendered)
    },
    fichePage() {
      return window.location.origin + `/fiche/${this.fiche.slug}`
    }
  },
  mounted() {
    this.shareApiAvailable = typeof navigator.share === 'function'
  },
  methods: {
    shareWith(title, text, url) {
      return navigator.share({ title, text, url })
    }
  }
}
</script>

<style scoped></style>
