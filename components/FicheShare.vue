<template>
  <span id="share">
    <template v-if="shareApiAvailable">
      <button
        class="btn btn-sm btn-outline-secondary text-black"
        @click.prevent="shareWith('Fiche sur La Chouquette', escapedTitle, fichePage)"
      >
        <span class="mx-1"><i class="fas fa-share-alt"></i></span>
      </button>
    </template>
    <template v-else>
      <b-dropdown size="sm" dropup no-caret variant="outline-secondary" toggle-class="text-black">
        <template #button-content>
          <span title="Partager" class="mx-1"><i class="fas fa-share-alt"></i></span>
        </template>
        <template #default>
          <b-dropdown-item
            :href="`https://www.facebook.com/sharer/sharer.php?u=${fichePage}`"
            target="_blank"
            variant="secondary"
          >
            <span style="color: #4267b2" class="mr-2"><i class="fab fa-facebook-square"></i></span> Facebook
          </b-dropdown-item>
          <b-dropdown-item
            :href="`https://twitter.com/share?text=${escapedTitle}&url=${encodeURI(fichePage)}`"
            target="_blank"
            variant="secondary"
          >
            <span style="color: #38A1F3" class="mr-2"><i class="fab fa-twitter-square"></i></span> Twitter
          </b-dropdown-item>
          <b-dropdown-item :href="`https://wa.me/?text=${encodeURI(fichePage)}`" target="_blank" variant="secondary">
            <span style="color: #25d366" class="mr-2"><i class="fab fa-whatsapp-square"></i></span> WhatsApp
          </b-dropdown-item>
          <b-dropdown-item
            :href="`mailto:?subject=${escapedTitle}&amp;body=Je te partage cet article ${fichePage}`"
            variant="secondary"
          >
            <span style="color: #b7b7b7" class="mr-2"><i class="fas fa-envelope-square"></i></span> Email
          </b-dropdown-item>
        </template>
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
      fichePage: null
    }
  },
  computed: {
    escapedTitle() {
      return this.$options.filters.heDecode(this.fiche.title.rendered)
    }
  },
  mounted() {
    this.shareApiAvailable = typeof navigator.share === 'function'
    this.fichePage = window.location.origin + `/fiche/${this.fiche.slug}`
  },
  methods: {
    shareWith(title, text, url) {
      return navigator.share({ title, text, url })
    }
  }
}
</script>

<style scoped>
a.dropdown-item span {
  font-size: 1.2rem;
}
</style>
