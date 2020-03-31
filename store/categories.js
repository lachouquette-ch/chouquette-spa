import _ from 'lodash'
import CategoryAPI from '~/api/wordpress/categories'

export const state = () => ({
  all: {}
})

export const actions = {
  async fetchByIds({ commit, state }, ids) {
    const unknownCategoryIds = _.difference(ids, Object.keys(state.all))
    const newCategories = await CategoryAPI.getByIds(unknownCategoryIds)
    commit('SET_CATEGORIES', newCategories)

    return ids.map((id) => state.all[id])
  },
  async fetchById({ commit, state }, id) {
    if (state.all[id]) {
      return Promise.resolve(state.all[id])
    } else {
      const category = await CategoryAPI.getById(id)
      commit('SET_CATEGORY', category)
      return category
    }
  }
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    categories.forEach((category) => (state.all[category.id] = category))
  },
  SET_CATEGORY(state, category) {
    state.all[category.id] = category
  }
}
