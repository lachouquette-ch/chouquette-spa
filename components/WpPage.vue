<template>
  <b-overlay :show="!page" spinner-variant="yellow">
    <div class="wp-page container layout-content my-4">
      <div v-if="page" class="row">
        <div class="col gutenberg-content">
          <h1 class="text-center mb-4">{{ page.title.rendered | heDecode }}</h1>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="page.content.rendered" />
        </div>
      </div>
      <div v-if="$slots.footer" class="row">
        <div class="col">
          <slot name="footer" />
        </div>
      </div>
    </div>
    <Newsletter />
  </b-overlay>
</template>

<script>
import seo from '~/mixins/seo'
import gutenberg from '~/mixins/gutenberg'
import Newsletter from '~/components/Newsletter'

export default {
  components: { Newsletter },
  mixins: [seo, gutenberg],
  props: {
    page: {
      type: Object,
      required: true,
    },
  },
  head() {
    return {
      title: this.$options.filters.heDecode(this.page.yoast_title),
      link: this.gutenbergLinks(),
      meta: this.yoastMetaProperties(this.page.yoast_meta),
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.$options.filters.heDecode(this.page.yoast_title),
          description: this.yoastGetDescription(this.page.yoast_meta),
        }),
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.wp-page {
  min-height: 100vh;
}
</style>
