import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates()
})

export const actions = {
  fetchByIds(context, ids) {
    return ressourceActions.fetchByIds(this.$wpAPI.wp.categories, 'SET_CATEGORIES', context, ids)
  },
  fetchById(context, id) {
    return ressourceActions.fetchById(this.$wpAPI.wp.categories, 'SET_CATEGORY', context, id)
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
