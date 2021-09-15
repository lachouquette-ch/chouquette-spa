<template>
  <v-card class="d-flex flex-row" height="75" width="250" flat tile ripple @click="btnAction">
    <WpMediaNew
      :media="fiche.image"
      size="thumbnail"
      width="75"
      contain
      aspect-ratio="1"
      class="flex-grow-0"
    ></WpMediaNew>
    <v-card-text class="pa-2 flex-grow-1 overflow-hidden">
      <p class="ma-0 text-body-1 text-truncate">{{ fiche.title }}</p>
      <p class="ma-0 text-body-2 font-italic">{{ categoryName }}</p>
      <span class="text-caption text-decoration-underline">Voir Plus</span>
    </v-card-text>
  </v-card>
</template>

<script>
import WpMediaNew from '~/components/WpMediaNew'

export default {
  components: { WpMediaNew },
  props: {
    fiche: {
      type: Object,
      required: true,
    },
    btnAction: {
      type: Function,
      default: () => {
        // eslint-disable-next-line no-console
        console.log('Show btn action')
      },
    },
  },
  computed: {
    googleMapsURL() {
      return `https://maps.google.com/?q=${this.fiche.poi.address}`
    },
    categoryName() {
      // hack since no $nuxt context attached (component created manually)
      return this.$nuxt.$store.state.categories.all[this.fiche.principalCategoryId].name
    },
  },
}
</script>

<style lang="scss" scoped>
.fiche-infowindow {
  width: 250px;
  max-width: 100%;

  h2 {
    font-family: $heading-font-family;
  }
}

.fiche-infowindow-img {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
}
</style>
