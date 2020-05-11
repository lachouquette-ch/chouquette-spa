import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  criteria: {},
  ...ressourceStates()
})

export const actions = {
  async fetchRelatedRessources({ dispatch, commit }, fiches) {
    // fetch criteria
    const ficheIds = fiches.map(({ id }) => id)
    const criteriaList = this.$wpAPI.criteria.getForFiches(ficheIds).then(({ data }) => {
      commit('SET_CRITERIA_LIST', data)
    })

    // fetch featured media
    const mediaIds = fiches.map(({ featured_media }) => featured_media).filter(Boolean)

    await Promise.all([criteriaList, dispatch('media/fetchByIds', mediaIds, { root: true })])
  },

  async fetchByIds(context, ids) {
    const fiches = await ressourceActions.fetchByIds(this.$wpAPI.wp.fiches, 'SET_FICHES', context, ids)

    // sort by "Chouquettise" since WP return same order than includes
    const sortedFiches = fiches.sort((el1, el2) => {
      return el2.info.chouquettise - el1.info.chouquettise
    })

    return sortedFiches
  },

  async fetchById(context, id) {
    return await ressourceActions.fetchById(this.$wpAPI.wp.fiches, 'SET_FICHE', context, id)
  },

  async fetchByText({ dispatch, commit }, { search, page = 1 }) {
    const { data: fiches, headers } = await this.$wpAPI.wp.fiches.get({
      search,
      page
    })

    // fetch related ressources
    await dispatch('fetchRelatedRessources', fiches)

    commit('SET_FICHES', fiches)
    return { fiches, total: parseInt(headers['x-wp-total']), pages: parseInt(headers['x-wp-totalpages']) }
  },

  async fetchByCategoryIds({ dispatch, commit }, { categoryIds, page = 1, per_page = 10 }) {
    const { data: fiches, headers } = await this.$wpAPI.wp.fiches.get({
      categories: categoryIds.join(','),
      page,
      per_page
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
  }
}
