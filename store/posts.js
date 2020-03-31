export const state = () => ({
  post: null
})

export const actions = {
  async fetchBySlug({ commit }, slug) {
    const posts = await this.$axios.$get(`${process.env.wpAPIBaseUrl}/posts?slug=${slug}&_embed=true`)
    commit('setPost', posts[0])
    return posts[0]
  }
}

export const mutations = {
  setPost(state, post) {
    state.post = post
  }
}
