import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  criteria: {},
  ...ressourceStates()
})

export const actions = {
  async fetchRelatedRessources({ dispatch }, fiches) {
    const mediaIds = fiches.map(({ featured_media }) => featured_media).filter(Boolean)
    await dispatch('media/fetchByIds', mediaIds, { root: true })
  },

  async fetchByIds(context, ids) {
    const fiches = await ressourceActions.fetchByIds(this.$wpAPI.wp.fiches, 'SET_FICHES', context, ids)

    // fetch criteria list
    const ficheIds = fiches.map(({ id }) => id)
    const criteriaList = await this.$wpAPI.criteria.getForFiches(ficheIds).then(({ data }) => data)

    context.commit('SET_CRITERIA_LIST', criteriaList)

    // sort by chouquettise
    const sortedFiches = fiches.sort((el1, el2) => {
      return el2.info.chouquettise - el1.info.chouquettise
    })

    return sortedFiches
  },

  async fetchById(context, id) {
    const fiche = await ressourceActions.fetchById(this.$wpAPI.wp.fiches, 'SET_FICHE', context, id)

    // fetch criteria
    const criteria = await this.$wpAPI.criteria.getForFiche(id).then(({ data }) => data)
    context.commit('SET_CRITERIA', id, criteria)

    return fiche
  },

  async fetchByText({ dispatch, commit }, text) {
    const { data: fiches, headers } = await this.$wpAPI.wp.fiches.get({
      search: text,
      per_page: 20
    })

    // fetch related ressources
    await dispatch('fetchRelatedRessources', fiches)

    commit('SET_FICHES', fiches)
    return { fiches, total: parseInt(headers['x-wp-total']), pages: parseInt(headers['x-wp-totalpages']) }
  }
}

export const mutations = {
  SET_FICHES(state, posts) {
    ressourceMutations.setRessources(state, posts)
  },
  SET_FICHE(state, posts) {
    ressourceMutations.setRessource(state, posts)
  },
  SET_CRITERIA_LIST(state, criteriaList) {
    state.criteria = Object.assign({}, state.criteria, criteriaList)
  },
  SET_CRITERIA(state, id, criteria) {
    state.criteria[id] = criteria
  }
}
