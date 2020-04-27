import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates()
})

export const actions = {
  async fetchRelatedRessources({ dispatch }, categories) {
    const mediaIds = categories.map(({ logos }) => Object.values(logos))

    await Promise.all([dispatch('media/fetchByIds', mediaIds, { root: true })])
  },

  async fetchByIds(context, ids) {
    const categories = await ressourceActions.fetchByIds(this.$wpAPI.wp.categories, 'SET_CATEGORIES', context, ids)

    // fetch related ressources
    await context.dispatch('fetchRelatedRessources', categories)

    return categories
  },

  async fetchById(context, id) {
    const category = await ressourceActions.fetchById(this.$wpAPI.wp.categories, 'SET_CATEGORY', context, id)

    // fetch related ressources
    await context.dispatch('fetchRelatedRessources', [category])

    return category
  }
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    ressourceMutations.setRessources(state, categories)
  },
  SET_CATEGORY(state, category) {
    ressourceMutations.setRessource(state, category)
  }
}
