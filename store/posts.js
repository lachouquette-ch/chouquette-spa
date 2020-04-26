import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates()
})

export const actions = {
  async fetchByIds(context, ids) {
    const posts = ressourceActions.fetchByIds(this.$wpAPI.wp.posts, 'SET_POSTS', context, ids)

    // fetch related ressources
    const categoryIds = posts.flatMap(({ top_categories }) => top_categories)
    const mediaIds = posts.map(({ featured_media }) => featured_media).filter(Boolean)

    await Promise.all([
      context.dispatch('categories/fetchByIds', categoryIds),
      context.dispatch('media/fetchByIds', mediaIds)
    ])

    return posts
  },
  fetchById(context, id) {
    return ressourceActions.fetchById(this.$wpAPI.wp.posts, 'SET_POST', context, id)
  }
}

export const mutations = {
  SET_POSTS(state, categories) {
    ressourceMutations.setRessources(state, categories)
  },
  SET_POST(state, category) {
    ressourceMutations.setRessource(state, category)
  }
}
