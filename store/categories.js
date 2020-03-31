export const state = () => ({
  all: {}
})

export const actions = {
  async fetchMany({ commit, state }, ids) {
    const idList = ids.join(',')
    const categories = await this.$axios.$get(
      `${process.env.wpAPIBaseUrl}/categories/?include=${idList}&per_page=${ids.length}&context=embed`
    )
    commit('setCategories', categories)
    return categories
  },
  async get({ commit, state }, id) {
    if (state.all[id]) {
      return Promise.resolve(state.all[id])
    } else {
      const category = await this.$axios.$get(
        `${process.env.wpAPIBaseUrl}/categories/${id}?context=embed`
      )
      commit('setCategory', category)
      return category
    }
  }
}

export const mutations = {
  setCategories(state, categories) {
    categories.forEach((category) => (state.all[category.id] = category))
  },
  setCategory(state, category) {
    state.all[category.id] = category
  }
}
