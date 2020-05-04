<template>
  <div class="layout-content container">
    <h1 class="text-center my-4">{{ category.name }}</h1>
    <div class="h3">Ma recherche</div>
    <div class="d-flex justify-content-around flex-wrap my-4">
      <Fiche v-for="fiche in fiches" :key="fiche.id" :fiche="fiche" :responsive="false" class="mx-2 mb-3" />
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
  },
  created() {
    this.$store.dispatch('menus/setSelectedCategory', this.category)
  }
}
</script>

<style scoped></style>
