<template>
  <div class="category-page layout-content">
    <PageFiches
      ref="category"
      :root-category="rootCategory"
      :query-category="queryCategory"
      :query-location="queryLocation"
      :query-search="querySearch"
      :query-criteria="queryCriteria"
    />
  </div>
</template>

<script>
import PageFiches from '~/components/PageFiches'
import seo from '~/mixins/seo'

export default {
  components: { PageFiches },
  mixins: [seo],
  async asyncData({ store, params, query, app }) {
    // store initialization
    await store.dispatch('yoast/init')

    const rootCategory = await store.dispatch('categories/fetchBySlug', params.slug)

    // build criteria
    const queryCategory = query.category || rootCategory.slug
    const queryLocation = query.location
    const querySearch = query.search
    const queryCriteria = Object.entries(query)
      .filter(([key]) => key.startsWith('cq_'))
      .map(([key, value]) => {
        return { taxonomy: key, values: value.split(',') }
      })

    return {
      rootCategory,

      queryCategory,
      queryLocation,
      querySearch,
      queryCriteria,
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path === from.path) {
      // build criteria
      const criteria = Object.entries(to.query)
        .filter(([key]) => key.startsWith('cq_'))
        .map(([key, value]) => {
          return { taxonomy: key, values: value.split(',') }
        })

      this.$refs.category.defaultCategory = to.query.category || this.rootCategory.slug
      this.$refs.category.defaultLocation = to.query.location
      this.$refs.category.defaultSearch = to.query.search
      this.$refs.category.defaultCriteria = criteria

      this.$refs.category.reload()
    }

    next()
  },
  async beforeRouteLeave(to, from, next) {
    await this.$store.dispatch('menus/clearSelectedCategory')
    next()
  },
  head() {
    return {
      title: this.rootCategory.name + ' - ' + this.rootCategory.description,
      meta: this.seoMetaProperties([
        {
          name: 'description',
          content: this.rootCategory.description || this.rootCategory.name,
        },
        {
          name: 'robots',
          content: 'noindex',
        },

        { property: 'og:type', content: 'article' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:url', content: this.currentURL },
        { property: 'og:title', content: this.rootCategory.name },
        {
          property: 'og:description',
          content: this.rootCategory.description || this.rootCategory.name,
        },
        { property: 'og:image', content: this.rootCategory.logoBlack.source },

        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: this.rootCategory.name },
        {
          name: 'twitter:description',
          content: this.rootCategory.description || this.rootCategory.name,
        },
        { name: 'twitter:image', content: this.rootCategory.logoBlack.source },
      ]),
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.rootCategory.name,
          description: this.rootCategory.description || this.rootCategory.name,
          publisher: {
            '@type': 'Organization',
            name: 'La Chouquette',
            logo: `${this.$config.baseURL}/logo.png`,
          },
          url: this.currentURL,
        }),
      ],
    }
  },
}
</script>

<style scoped></style>
