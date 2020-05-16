<template>
  <div class="fiche-page layout-content container my-4">
    <h1 class="text-center mb-4">{{ fiche.title.rendered | heDecode }}</h1>
    <main role="main">
      <Fiche :fiche="fiche" no-ref-link />
    </main>
  </div>
</template>

<script>
import Fiche from '../../components/Fiche'
import yoast from '~/mixins/yoast'

export default {
  components: { Fiche },
  mixins: [yoast],
  async asyncData({ app, params }) {
    const fiche = await app.$wpAPI.wp.fiches.getBySlug(params.slug).then(({ data }) => data[0])

    return {
      fiche
    }
  },
  data() {
    return {
      fiche: null
    }
  },
  head() {
    return {
      title: this.$options.filters.heDecode(this.fiche.title.rendered),
      meta: this.yoastMetaConfig(this.fiche.yoast_meta),
      script: this.yoastJsonLDConfig(this.fiche.yoast_json_ld)
    }
  }
}
</script>

<style lang="scss" scoped>
.fiche-page {
  h1 {
    font-family: $font-family-heading;
  }
}
</style>
