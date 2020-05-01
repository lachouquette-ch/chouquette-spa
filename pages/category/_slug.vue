<template>
  <div class="layout-content">
    <h1>{{ category.name }}</h1>
    <div>Ma recherche</div>
    <div class="flex-column">
      <Fiche v-for="fiche in fiches" :key="fiche.id" :fiche="fiche" :responsive="false" />
    </div>
  </div>
</template>

<script>
import Fiche from '~/components/Fiche'
export default {
  components: { Fiche },
  async asyncData({ store, params }) {
    const category = await store.dispatch('categories/fetchBySlug', params.slug)
    const subCategories = store.state.categories.children[category.id] // fetched along category

    const subCategoryIds = subCategories.map(({ id }) => id)
    const ficheResult = await store.dispatch('fiches/fetchByCategoryIds', {
      categoryIds: [category.id, ...subCategoryIds]
    })

    return {
      category,
      fiches: ficheResult.fiches,
      fichesTotal: ficheResult.total,
      fichesPages: ficheResult.pages,
      fichesNextPage: 2,
      fichesLoading: false
    }
  }
}
</script>

<style scoped></style>
