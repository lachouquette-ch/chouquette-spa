<template>
  <div class="fiche-infowindow text-center">
    <h2 class="h4">{{ fiche.title.rendered | heDecode }}</h2>
    <WpMedia v-if="featuredMedia" :media="featuredMedia" size="thumbnail" :no-src-set="true" class="" />
    <p class="my-2 muted">{{ address }}</p>
    <a v-if="fiche.info.chouquettise" :href="googleMapsURL" class="" title="Ouvrir avec Google maps" target="_blank">
      <i class="fas fa-map-marker-alt pr-1"></i> Ouvrir dans google maps
    </a>
    <button class="btn btn-sm btn-outline-secondary d-block my-2 mx-auto" @click="showBtnAction">
      Voir la fiche
    </button>
  </div>
</template>

<script>
import WpMedia from '~/components/WpMedia'

export default {
  components: { WpMedia },
  props: {
    fiche: {
      type: Object,
      required: true
    },
    featuredMedia: {
      type: Object,
      required: true
    },
    showBtnAction: {
      type: Function,
      default: () => {
        console.log('Show btn action')
      }
    }
  },
  computed: {
    address() {
      return this.fiche.info.location.address
    },
    googleMapsURL() {
      return `https://maps.google.com/?q=${this.fiche.info.location.address}`
    }
  }
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
</style>
