import PostAPI from '~/api/wordpress/posts'

export const state = () => ({
  post: null
})

export const actions = {
  async fetchBySlug({ commit }, slug) {
    const posts = await PostAPI.getBySlug(slug)
    commit('setPost', posts)
    return posts
  }
}

export const mutations = {
  setPost(state, post) {
    state.post = post
  }
}
