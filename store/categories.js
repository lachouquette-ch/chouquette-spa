export const state = () => ({
  all: {}
})

export const actions = {
  async fetchMany({ commit, state }, ids) {
    const idList = ids.join(',')
    const categories = await this.$axios.$get(
      `https://uat.lachouquette.ch/wp-json/wp/v2/categories/?include=${idList}&context=embed`
    )
    commit('setCategories', categories)
    return categories
  },
  async getSingle({ commit, state }, id) {
    if (state[id]) {
      return Promise.resolve(state[id])
    } else {
      const category = await this.$axios.$get(
        `https://uat.lachouquette.ch/wp-json/wp/v2/categories/${id}?context=embed`
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
