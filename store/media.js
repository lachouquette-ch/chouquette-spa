import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates()
})

export const actions = {
  fetchRelatedRessources(context, mediaList) {
    return Promise.resolve()
  },
  async fetchByIds(context, ids) {
    return await ressourceActions.fetchByIds(this.$wpAPI.wp.media, 'SET_MEDIA_LIST', context, ids)
  },
  async fetchById(context, id) {
    return await ressourceActions.fetchById(this.$wpAPI.wp.media, 'SET_MEDIA', context, id)
  }
}

export const mutations = {
  SET_MEDIA_LIST(state, mediaList) {
    ressourceMutations.setRessources(state, mediaList)
  },
  SET_MEDIA(state, media) {
    ressourceMutations.setRessource(state, media)
  }
}
