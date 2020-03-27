export const stat = () => ({
  post: null
})

export const getters = {
  featuredMedia: (state) => {
    return state.post._embedded['wp:featuredmedia'][0]
  },
  author: (state) => {
    return state.post._embedded.author[0]
  },
  categories: (state) => {
    return state.post._embedded['wp:term'][0]
  },
  tags: (state) => {
    return state.post._embedded['wp:term'][1]
  }
}

export const actions = {
  async fetchPost({ commit }, slug) {
    const posts = await this.$axios.$get(
      `https://uat.lachouquette.ch/wp-json/wp/v2/posts?slug=${slug}&_embed=true`
    )
    commit('setPost', posts[0])
  }
}

export const mutations = {
  setPost(state, post) {
    state.post = post
  }
}
