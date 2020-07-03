import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates(),
})

export const actions = {
  async fetchRelatedRessources({ dispatch }, posts) {
    /* eslint-disable camelcase */
    const categoryIds = posts.flatMap(({ top_categories }) => top_categories)
    const mediaIds = posts.map(({ featured_media }) => featured_media).filter(Boolean)
    /* eslint-enable camelcase */

    await Promise.all([
      dispatch('categories/fetchByIds', categoryIds, { root: true }),
      dispatch('media/fetchByIds', mediaIds, { root: true }),
    ])
  },

  async fetchLatests({ commit, dispatch }, number) {
    const posts = await this.$wpAPI.wp.posts
      .get({
        sticky: true,
        per_page: number,
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

  async fetchByTagSlug({ commit, dispatch }, { slug, number = null }) {
    // first get tag
    const tag = await dispatch('tags/fetchBySlug', slug, { root: true })

    const posts = await this.$wpAPI.wp.posts
      .get({
        tags: tag.id,
        per_page: number,
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
        per_page: 6,
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

  async fetchByText({ dispatch, commit }, { search, page = 1 }) {
    const { data: posts, headers } = await this.$wpAPI.wp.posts.get({
      search,
      page,
    })

    // fetch related ressources
    await dispatch('fetchRelatedRessources', posts)

    commit('SET_POSTS', posts)
    return { posts, total: parseInt(headers['x-wp-total']), pages: parseInt(headers['x-wp-totalpages']) }
  },
}

export const mutations = {
  SET_POSTS(state, posts) {
    ressourceMutations.setRessources(state, posts)
  },
  SET_POST(state, posts) {
    ressourceMutations.setRessource(state, posts)
  },
}
