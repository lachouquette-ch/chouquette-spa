<template>
  <div class="category-page layout-content">
    <PageFiches
      ref="category"
      :root-location="rootLocation"
      :query-category="queryCategory"
      :query-location="queryLocation"
      :query-search="querySearch"
      :query-criteria="queryCriteria"
      :init-fiches="initFiches"
      :init-fiches-total="initFichesTotal"
      :init-fiches-pages="initFichesPages"
    />
  </div>
</template>

<script>
import PageFiches from '~/components/PageFiches'
import { PER_PAGE_NUMBER } from '~/constants/default'

export default {
  components: { PageFiches },
  async asyncData({ store, params, query }) {
    // store initialization
    await store.dispatch('locations/init')
    await store.dispatch('menus/init')

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

    const ficheResult = await store.dispatch('fiches/fetchByCategoryIds', {
      category: queryCategory,
      location: queryLocation,
      search: querySearch,
      criteria: queryCriteria,
      per_page: PER_PAGE_NUMBER
    })

    return {
      rootLocation,

      queryCategory,
      queryLocation,
      querySearch,
      queryCriteria,

      initFiches: ficheResult.fiches,
      initFichesTotal: ficheResult.total,
      initFichesPages: ficheResult.pages,
      initFichesNextPage: 2
    }
  },
  data() {
    return {
      test: 'default'
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
      title: this.rootLocation.name
    }
  }
}
</script>

<style scoped></style>
