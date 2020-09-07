<template>
  <div class="container layout-content my-3">
    <form @submit.prevent="search">
      <div class="form-group">
        <select v-model="selectedCategory" class="form-control form-control">
          <option :value="null">Select your category</option>
          <option v-for="(category, id) in categories" :key="id" :value="category">{{ category.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <select v-model="selectedSubCategory" class="form-control form-control" :disabled="!subCategories">
          <option :value="null">Select your sub category</option>
          <option v-for="(category, id) in subCategories" :key="id" :value="category">{{ category.name }}</option>
        </select>
      </div>
      <div v-for="criteria in criteriaList" :key="criteria.id" class="form-group">
        <label :for="criteria.taxonomy">{{ criteria.name }}</label>
        <select :id="criteria.taxonomy" v-model="criteria.selectedValues" multiple class="form-control" @>
          <option v-for="value in criteria.values" :key="value.id" :value="value.slug">{{ value.name }}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Rechercher</button>
    </form>
    {{ fiches }}
  </div>
</template>

<script>
export default {
  async asyncData({ store }) {
    await store.dispatch('menus/init')
    const categories = store.state.menus.headerCategories
    return {
      categories,
    }
  },
  data() {
    return {
      fiches: [],
      selectedCategory: null,
      selectedSubCategory: null,
      subCategories: [],
      criteriaList: [],
    }
  },
  computed: {
    viewSelectedCriteria() {
      return this.criteriaList.map(({ name, selectedValues }) => {
        return {
          name,
          selectedValues,
        }
      })
    },
  },
  watch: {
    async selectedCategory(category) {
      if (category) {
        this.subCategories = await this.$store.dispatch('categories/findChildren', category)
      } else {
        this.subCategories = []
      }
      this.selectedSubCategory = null
      await this.fillCriteria()
    },
    async selectedSubCategory(category) {
      await this.fillCriteria()
    },
  },
  methods: {
    async fillCriteria() {
      const category = this.selectedSubCategory || this.selectedCategory || null
      if (category) {
        const criteriaList = (await this.$wpAPI.criteria.getForCategory(category.id).then(({ data }) => data)) || []
        criteriaList.forEach((criteria) => {
          criteria.selectedValues = []
        })
        this.criteriaList = criteriaList
      } else {
        this.criteriaList = []
      }
    },
    async search() {
      const termList = this.criteriaList.flatMap(({ taxonomy, selectedValues }) => {
        return selectedValues.map((value) => {
          return {
            taxonomy,
            value,
          }
        })
      })
      this.fiches = await this.$esAPI.searchFichesByCriteria(termList)
    },
  },
}
</script>

<style lang="scss" scoped></style>
