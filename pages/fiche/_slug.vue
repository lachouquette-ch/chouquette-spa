<template>
  <div v-if="fiche" class="fiche-page layout-content container-fluid mx-auto">
    <h1 class="text-center my-4">{{ escapedTitle }}</h1>
    <main role="main">
      <Fiche :fiche="fiche" />
    </main>
  </div>
</template>

<script>
import he from 'he'

import Fiche from '../../components/Fiche'

export default {
  components: { Fiche },
  data() {
    return {
      fiche: null
    }
  },
  computed: {
    escapedTitle() {
      return he.decode(this.fiche.title.rendered)
    }
  },
  async created() {
    this.fiche = await this.$wpAPI.wp.fiches.getBySlug(this.$route.params.slug)
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
