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
  async asyncData({ store, params, query }) {
    const rootCategory = await store.dispatch('categories/fetchBySlug', params.slug)
    const rootLogo = await store.dispatch('media/fetchById', rootCategory.logos.logo_black)

    // store initialization
    await store.dispatch('locations/init')
    await store.dispatch('menus/init')
    await store.dispatch('menus/setSelectedCategory', rootCategory)

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
      rootLogo,

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
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('menus/clearSelectedCategory').then(() => next())
  },
  head() {
    return {
      title: this.rootCategory.name + ' - ' + this.rootCategory.description,
      meta: [
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.rootLogo.source_url,
        },
      ],
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: this.$options.filters.heDecode(this.rootCategory.name),
          description: this.$options.filters.heDecode(this.rootCategory.description),
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
