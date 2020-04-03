export const state = () => ({
  all: []
})

export const actions = {
  addAction({ commit, state }, { type, message }) {
    commit('SET_ALERT', {
      type,
      message
    })
  },
  removeAction({ commit, state }, alert) {
    const index = state.all.findIndex((el) => el.type === alert.type && el.message === alert.message)
    commit('REMOVE_ALERT', index)
  }
}

export const mutations = {
  SET_ALERT(state, alert) {
    state.all.push(alert)
  },
  REMOVE_ALERT(state, index) {
    state.all.splice(index, 1)
  }
}
