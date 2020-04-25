import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates()
})

export const actions = {
  fetchBySlug(context, slug) {
    return ressourceActions.fetchBySlug(this.$wpAPI.wp.tags, 'SET_TAG', context, slug)
  }
}

export const mutations = {
  SET_TAG(state, tag) {
    ressourceMutations.setRessource(state, tag)
  }
}
