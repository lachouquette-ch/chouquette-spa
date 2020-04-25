import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates()
})

export const actions = {
  fetchByIds(context, ids) {
    return ressourceActions.fetchByIds(this.$wpAPI.wp.media, 'SET_MEDIA_LIST', context, ids)
  },
  fetchById(context, id) {
    return ressourceActions.fetchById(this.$wpAPI.wp.media, 'SET_MEDIA', context, id)
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
