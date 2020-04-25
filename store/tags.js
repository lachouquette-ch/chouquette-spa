export const state = () => ({
  all: {}
})

export const actions = {
  async fetchBySlug({ commit, state }, slug) {
    const tag = await this.$wpAPI.wp.tags.getBySlug(slug)
    commit('SET_TAG', tag)
    return tag
  }
}

export const mutations = {
  SET_TAG(state, tag) {
    state.all[tag.id] = tag
  }
}
