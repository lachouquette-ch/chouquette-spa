<template>
  <div class="category-page layout-content">
    <PageFiches
      ref="category"
      :root-category="rootCategory"
      :init-category="initCategory"
      :init-location="initLocation"
      :init-search="initSearch"
      :init-criteria="initCriteria"
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
    const rootCategory = await store.dispatch('categories/fetchBySlug', params.slug)

    // store initialization
    await store.dispatch('locations/init')
    await store.dispatch('menus/init')
    await store.dispatch('menus/setSelectedCategory', rootCategory)

    // build criteria
    const initCategory = query.category || rootCategory.slug
    const initLocation = query.location
    const initSearch = query.search
    const initCriteria = Object.entries(query)
      .filter(([key]) => key.startsWith('cq_'))
      .map(([key, value]) => {
        return { taxonomy: key, values: value.split(',') }
      })

    const ficheResult = await store.dispatch('fiches/fetchByCategoryIds', {
      initCategory,
      initLocation,
      initSearch,
      initCriteria,
      per_page: PER_PAGE_NUMBER
    })

    return {
      rootCategory,

      initCategory,
      initLocation,
      initSearch,
      initCriteria,

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

      this.$refs.category.category = to.query.category || this.rootCategory.slug
      this.$refs.category.location = to.query.location
      this.$refs.category.search = to.query.search
      this.$refs.category.criteria = criteria

      this.$refs.category.reload()
    }

    next()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('menus/clearSelectedCategory').then(() => next())
  },
  head() {
    return {
      title: this.rootCategory.name
    }
  }
}
</script>

<style scoped></style>
