<template>
  <div v-if="fiche" class="fiche-page layout-content container-fluid mx-auto my-5">
    <h1 class="text-center my-4">{{ fiche.title.rendered | heDecode }}</h1>
    <main role="main">
      <Fiche :fiche="fiche" />
    </main>
  </div>
</template>

<script>
import Fiche from '../../components/Fiche'

export default {
  components: { Fiche },
  data() {
    return {
      fiche: null
    }
  },
  async created() {
    this.fiche = await this.$wpAPI.wp.fiches.getBySlug(this.$route.params.slug).then(({ data }) => data[0])
  }
}
</script>

<style lang="scss" scoped>
.fiche-page {
  h1 {
    font-family: $font-family-heading;
  }
}

.fiche.highlight {
  @include media-breakpoint-up(md) {
    .card {
      box-shadow: $box-shadow-lg !important;
    }
  }
}
</style>
