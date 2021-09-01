export const state = () => ({
  all: {},
  flat: [],
})

export const actions = {
  init({ state, commit }, values) {
    commit('SET_VALUES', values)

    return values
  },
}

export const getters = {
  getBySlug: (state) => (slug) => state.flat.find(({ itemSlug }) => itemSlug === slug),

  getById: (state) => (id) => state.all[id],
}

export const mutations = {
  SET_VALUES(state, values) {
    state.all = values.reduce((acc, value) => {
      acc[parseInt(value.id)] = value
      return acc
    }, {})
    state.flat = values
  },
}
