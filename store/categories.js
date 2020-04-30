import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates()
})

export const actions = {
  async fetchRelatedRessources({ dispatch }, categories) {
    const mediaIds = categories.flatMap(({ logos }) => Object.values(logos))

    await Promise.all([dispatch('media/fetchByIds', mediaIds, { root: true })])
  },

  async fetchByIds(context, ids) {
    return await ressourceActions.fetchByIds(this.$wpAPI.wp.categories, 'SET_CATEGORIES', context, ids)
  },

  async fetchById(context, id) {
    return await ressourceActions.fetchById(this.$wpAPI.wp.categories, 'SET_CATEGORY', context, id)
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
