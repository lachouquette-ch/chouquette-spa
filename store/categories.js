import CategoryAPI from '~/api/wordpress/categories'

export const state = () => ({
  all: {}
})

export const actions = {
  async fetchMany({ commit, state }, ids) {
    const categories = await CategoryAPI.getByIds(ids)
    commit('setCategories', categories)
    return categories
  },
  async get({ commit, state }, id) {
    if (state.all[id]) {
      return Promise.resolve(state.all[id])
    } else {
      const category = await CategoryAPI.getById(id)
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
