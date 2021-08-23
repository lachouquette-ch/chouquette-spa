<template>
  <v-card class="d-flex flex-row" height="75" width="250" flat tile ripple>
    <WpMediaNew
      :media="fiche.image"
      size="thumbnail"
      width="75"
      contain
      aspect-ratio="1"
      class="flex-grow-0"
    ></WpMediaNew>
    <v-list class="pa-2 flex-grow-1 overflow-hidden">
      <v-list-item-content class="pa-0">
        <v-list-item-title class="text-body-1">{{ fiche.title }}</v-list-item-title>
        <v-list-item-subtitle class="text-body-2 font-italic">{{ categoryName }}</v-list-item-subtitle>
        <v-list-item-subtitle class="text-caption"><a href="">Voir Plus</a></v-list-item-subtitle>
      </v-list-item-content>
    </v-list>
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
    showBtnAction: {
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
    font-family: $font-family-heading;
  }
}

.fiche-infowindow-img {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
}
</style>
