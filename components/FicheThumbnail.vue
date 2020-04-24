<template>
  <div
    class="media btn btn-outline-dark-grey border-0 p-0 shadow text-left"
    :class="{ 'btn-yellow': fiche.info.chouquettise }"
  >
    <WPMedia
      v-if="featuredMedia"
      :media="featuredMedia"
      size="thumbnail"
      class="fiche-img rounded-left"
      height="64"
      width="64"
    />
    <div class="media-body ml-1 p-1">
      <h3 class="text-center mb-1 h6" v-html="fiche.title.rendered"></h3>
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
.fiche-chouquettise {
  background-color: $chouquette-yellow;
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
