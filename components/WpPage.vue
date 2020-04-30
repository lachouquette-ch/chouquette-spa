<template>
  <b-overlay :show="!page" spinner-variant="yellow">
    <div class="wp-page container layout-content my-4">
      <div v-if="page" class="row">
        <div class="col gutenberg-content">
          <h1 class="text-center mb-4">{{ page.title.rendered | heDecode }}</h1>
          <div v-html="page.content.rendered" />
        </div>
      </div>
      <div v-if="$slots.footer" class="row">
        <div class="col">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import yoast from '~/mixins/yoast'
import gutenberg from '~/mixins/gutenberg'

export default {
  mixins: [yoast, gutenberg],
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  head() {
    return {
      title: this.page ? this.$options.filters.heDecode(this.page.title.rendered) : '',
      link: this.gutenbergLinks(),
      meta: this.page ? this.yoastMetaConfig(this.page.yoast_meta) : [],
      script: this.page ? this.yoastJsonLDConfig(this.page.yoast_json_ld) : []
    }
  }
}
</script>

<style lang="scss" scoped>
.wp-page {
  min-height: 100vh;
}
</style>
