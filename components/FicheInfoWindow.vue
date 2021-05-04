<template>
  <div class="fiche-infowindow text-center">
    <h2 class="h4">{{ fiche.title }}</h2>
    <WpMedia :media="fiche.image" size="medium" :no-src-set="true" class="fiche-infowindow-img" />
    <p class="my-2 muted">{{ fiche.poi.address }}</p>
    <a v-if="fiche.isChouquettise" :href="googleMapsURL" class="" title="Ouvrir avec Google maps" target="_blank">
      <i class="fas fa-map-marker-alt pr-1"></i> Ouvrir dans google maps
    </a>
    <button class="btn btn-sm btn-outline-secondary d-block my-2 mx-auto" @click="showBtnAction">Voir la fiche</button>
  </div>
</template>

<script>
import WpMedia from '~/components/WpMediaGQL'

export default {
  components: { WpMedia },
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
