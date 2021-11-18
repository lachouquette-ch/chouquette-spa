<template>
  <v-card elevation="0" min-height="100vh">
    <v-alert v-if="preview" border="right" colored-border type="warning" elevation="2">
      Mode prévisualisation : toutes les données ne seront pas affichées
    </v-alert>
    <v-card-title class="justify-center">
      <h1>{{ page.title }}</h1>
    </v-card-title>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <v-card-text class="gutenberg-content" v-html="page.content"></v-card-text>
    <div v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </v-card>
</template>

<script>
import seo from '~/mixins/seo'
import gutenberg from '~/mixins/gutenberg'

export default {
  mixins: [seo, gutenberg],
  props: {
    page: {
      type: Object,
      required: true,
    },
    preview: Boolean,
  },
  head() {
    if (this.preview) return { meta: [{ name: 'robots', content: 'none' }] }

    return {
      title: this.page.seo.title,
      link: this.gutenbergStylesheets(),
      meta: [
        ...this.seoMetaProperties(JSON.parse(this.page.seo.metadata)),
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${this.$config.siteUrl}/logo.png`,
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
            logo: `${this.$config.siteUrl}/logo.png`,
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
