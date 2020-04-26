import _ from 'lodash'
import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  criteria: {},
  ...ressourceStates()
})

export const actions = {
  async fetchRelatedRessources({ dispatch }, fiches) {
    return await Promise.resolve()
  },

  async fetchByIds(context, ids) {
    const fiches = await ressourceActions.fetchByIds(this.$wpAPI.wp.fiches, 'SET_FICHES', context, ids)
    // sort by chouquettise
    const sortedFiches = fiches.sort((el1, el2) => {
      return el2.info.chouquettise - el1.info.chouquettise
    })

    // fetch related ressources
    await context.dispatch('fetchRelatedRessources', sortedFiches)

    return sortedFiches
  },

  async fetchById(context, id) {
    const fiche = ressourceActions.fetchById(this.$wpAPI.wp.fiches, 'SET_FICHE', context, id)
    // fetch related ressources
    await context.dispatch('posts/fetchRelatedRessources', [fiche])

    return fiche
  }
}

export const mutations = {
  SET_FICHES(state, posts) {
    ressourceMutations.setRessources(state, posts)
  },
  SET_FICHE(state, posts) {
    ressourceMutations.setRessource(state, posts)
  }
}
