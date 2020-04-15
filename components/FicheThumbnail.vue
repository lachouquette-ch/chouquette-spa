<template>
  <div class="fiche btn btn-white media text-left">
    <WPMedia
      v-if="featuredMedia"
      :media="featuredMedia"
      size="thumbnail"
      class="fiche-img rounded-left"
      height="64"
      width="64"
    />
    <div class="media-body ml-1 p-1 text-black">
      <h3 class="mb-1 h6" v-html="fiche.title.rendered"></h3>
    </div>
    <span class="fiche-link"><i class="fas fa-external-link-alt"></i></span>
  </div>
</template>

<script>
import WPMedia from './WpMedia'

export default {
  components: { WPMedia },
  props: {
    fiche: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      featuredMedia: this.fiche._embedded['wp:featuredmedia'][0]
    }
  }
}
</script>

<style lang="scss" scoped>
.fiche {
  padding: 0;
  border: 0;
}

.fiche-chouquettise {
  border: 2px solid $chouquette-yellow;
}

.fiche-img {
  object-fit: cover;
}

.fiche-link {
  position: absolute;
  right: 5px;
  bottom: 5px;
}
</style>
