import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates()
})

export const actions = {
  async fetchRelatedRessources({ dispatch }, posts) {
    const categoryIds = posts.flatMap(({ top_categories }) => top_categories)
    const mediaIds = posts.map(({ featured_media }) => featured_media).filter(Boolean)

    await Promise.all([
      dispatch('categories/fetchByIds', categoryIds, { root: true }),
      dispatch('media/fetchByIds', mediaIds, { root: true })
    ])
  },

  async fetchLatests({ commit, dispatch }, number) {
    const posts = await this.$wpAPI.wp.posts
      .get({
        sticky: true,
        per_page: number
      })
      .then(({ data }) => data)
    const remainingPostCount = number - posts.length
    if (remainingPostCount) {
      const remainingPosts = await this.$wpAPI.wp.posts.get({ per_page: remainingPostCount }).then(({ data }) => data)
      posts.push(...remainingPosts)
    }

    // fetch related ressources
    await dispatch('fetchRelatedRessources', posts)

    commit('SET_POSTS', posts)
    return posts
  },

  async fetchTops({ commit, dispatch }, number) {
    // first get tag
    const topsTag = await dispatch('tags/fetchBySlug', 'tops', { root: true })

    const posts = await this.$wpAPI.wp.posts
      .get({
        tags: topsTag.id,
        per_page: number
      })
      .then(({ data }) => data)

    // fetch related ressources
    await dispatch('fetchRelatedRessources', posts)

    commit('SET_POSTS', posts)
    return posts
  },

  async fetchSimilar({ dispatch, commit }, post) {
    const posts = await this.$wpAPI.wp.posts
      .get({
        tags: post.tags.join(','),
        exclude: post.id,
        per_page: 6
      })
      .then(({ data }) => data)

    // fetch related ressources
    await dispatch('fetchRelatedRessources', posts)

    commit('SET_POSTS', posts)
    return posts
  },

  async fetchByIds(context, ids) {
    return await ressourceActions.fetchByIds(this.$wpAPI.wp.posts, 'SET_POSTS', context, ids)
  },

  async fetchById(context, id) {
    return await ressourceActions.fetchById(this.$wpAPI.wp.posts, 'SET_POST', context, id)
  },

  async fetchByText({ dispatch, commit }, text) {
    const posts = await this.$wpAPI.wp.posts
      .get({
        search: text,
        per_page: 20
      })
      .then(({ data }) => data)

    // fetch related ressources
    await dispatch('fetchRelatedRessources', posts)

    commit('SET_POSTS', posts)
    return posts
  }
}

export const mutations = {
  SET_POSTS(state, posts) {
    ressourceMutations.setRessources(state, posts)
  },
  SET_POST(state, posts) {
    ressourceMutations.setRessource(state, posts)
  }
}
