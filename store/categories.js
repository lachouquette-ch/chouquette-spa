import _ from 'lodash'

export const state = () => ({
  all: {},
  topLevels: {},
})

export const actions = {
  init({ state, commit, dispatch }, categories) {
    commit('SET_CATEGORIES', categories)
    return categories
  },

  // TODO keep those methods or use state mapping in vue components ?
  get({ state }, id) {
    return state.all[id]
  },
  fetchBySlug({ state }, slug) {
    return state.all.find((category) => category.slug === slug)
  },
  findChildren({ state }, category) {
    return state.topLevels[category.id]
  },
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    _.merge(
      state.topLevels,
      categories
        .filter(({ parentId }) => parentId === 0)
        .reduce((acc, category) => {
          acc[category.id] = []
          return acc
        }, {})
    )
    for (const category of categories) {
      state.all[category.id] = category
      // setup category if not root category
      if (category.parentId === 0) continue
      state.topLevels[category.parentId]
        ? state.topLevels[category.parentId].push(category)
        : console.warn(`No parent category for ${category.slug} (${category.id}). 3rd level category ?`)
    }
  },
}
