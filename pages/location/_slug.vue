<template>
  <div class="category-page layout-content">
    <PageFiches
      ref="category"
      :root-location="rootLocation"
      :query-category="queryCategory"
      :query-location="queryLocation"
      :query-search="querySearch"
      :query-criteria="queryCriteria"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PageFiches from '~/components/PageFiches'
import seo from '~/mixins/seo'

export default {
  components: { PageFiches },
  mixins: [seo],
  async asyncData({ store, params, query }) {
    // store initialization
    await store.dispatch('nuxtServerInit')

    const rootLocation = await store.dispatch('locations/fetchBySlug', params.slug)

    // build criteria
    const queryLocation = query.location || rootLocation.slug
    const queryCategory = query.category
    const querySearch = query.search
    const queryCriteria = Object.entries(query)
      .filter(([key]) => key.startsWith('cq_'))
      .map(([key, value]) => {
        return { taxonomy: key, values: value.split(',') }
      })

    return {
      rootLocation,

      queryCategory,
      queryLocation,
      querySearch,
      queryCriteria,
    }
  },
  computed: {
    ...mapState(['wordpressUrl']),
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path === from.path) {
      // build criteria
      const criteria = Object.entries(to.query)
        .filter(([key]) => key.startsWith('cq_'))
        .map(([key, value]) => {
          return { taxonomy: key, values: value.split(',') }
        })

      this.$refs.category.defaultLocation = to.query.location || this.rootLocation.slug
      this.$refs.category.defaultCategory = to.query.category
      this.$refs.category.defaultSearch = to.query.search
      this.$refs.category.defaultCriteria = criteria

      this.$refs.category.reload()
    }

    next()
  },
  head() {
    return {
      title: this.rootLocation.name,
      meta: this.seoMetaProperties([
        {
          name: 'description',
          content: this.$options.filters.heDecode(this.rootLocation.description || this.rootLocation.name),
        },

        { property: 'og:type', content: 'article' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:url', content: this.currentURL },
        { property: 'og:title', content: this.$options.filters.heDecode(this.rootLocation.name) },
        {
          property: 'og:description',
          content: this.$options.filters.heDecode(this.rootLocation.description || this.rootLocation.name),
        },
        { property: 'og:image', content: '' },

        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: this.$options.filters.heDecode(this.rootLocation.name) },
        {
          name: 'twitter:description',
          content: this.$options.filters.heDecode(this.rootLocation.description || this.rootLocation.name),
        },
        { name: 'twitter:image', content: '' },
      ]),
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.$options.filters.heDecode(this.rootLocation.name),
          description: this.$options.filters.heDecode(this.rootLocation.description || this.rootLocation.name),
          publisher: {
            '@type': 'Organization',
            name: 'La Chouquette',
            logo: `${this.wordpressUrl}/logo.png`,
          },
          url: this.currentURL,
        }),
      ],
    }
  },
}
</script>

<style scoped></style>
