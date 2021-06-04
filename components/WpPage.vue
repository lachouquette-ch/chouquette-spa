<template>
  <b-overlay :show="!page" spinner-variant="yellow">
    <div class="wp-page container layout-content my-4">
      <div v-if="preview" class="alert alert-warning text-center" role="alert">
        Mode prévisualisation : toutes les données ne seront pas affichées
      </div>
      <div v-if="page" class="row">
        <div class="col gutenberg-content">
          <h1 class="text-center mb-4">{{ page.title }}</h1>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="page.content" />
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
import { mapState } from 'vuex'
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
    preview: Boolean,
  },
  computed: {
    ...mapState(['wordpressUrl']),
  },
  head() {
    if (this.preview) return { meta: [{ name: 'robots', content: 'none' }] }

    return {
      title: this.page.seo.title,
      link: this.gutenbergLinks(),
      meta: [
        ...this.seoMetaProperties(JSON.parse(this.page.seo.metadata)),
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${this.wordpressUrl}/logo.png`,
        },
      ],
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.page.title,
          description: this.seoGetDescription(JSON.parse(this.page.seo.metadata)),
          publisher: {
            '@type': 'Organization',
            name: 'La Chouquette',
            logo: `${this.wordpressUrl}/logo.png`,
          },
          url: this.currentURL,
          datePublished: this.page.date,
          dateModified: this.page.modified,
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
