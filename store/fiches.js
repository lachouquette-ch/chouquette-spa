import _ from 'lodash'
import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  criteria: {},
  ...ressourceStates(),
})

export const actions = {
  async fetchRelatedRessources({ state, dispatch, commit }, fiches) {
    // fetch criteria
    const ficheIds = fiches.map(({ id }) => id)
    const unknownIds = _.differenceBy(_.uniq(ficheIds), Object.keys(state.criteria), parseInt)
    let criteriaList
    if (!_.isEmpty(unknownIds)) {
      criteriaList = this.$wpAPI.criteria.getForFiches(unknownIds).then(({ data }) => {
        commit('SET_CRITERIA_LIST', data)
      })
    } else {
      criteriaList = Promise.resolve()
    }

    // fetch featured media
    // eslint-disable-next-line camelcase
    const mediaIds = fiches.map(({ featured_media }) => featured_media).filter(Boolean)

    await Promise.all([criteriaList, dispatch('media/fetchByIds', mediaIds, { root: true })])
  },

  async fetchBySlug(context, slug) {
    return await ressourceActions.fetchBySlug(this.$wpAPI.wp.fiches, 'SET_FICHE', context, slug)
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
      page,
    })

    // fetch related ressources
    await dispatch('fetchRelatedRessources', fiches)

    commit('SET_FICHES', fiches)
    return { fiches, total: parseInt(headers['x-wp-total']), pages: parseInt(headers['x-wp-totalpages']) }
  },

  async fetchPreview({ dispatch, commit }, { id, nonce }) {
    const config = { withCredentials: true, headers: { 'X-WP-Nonce': nonce } }
    const fiche = await this.$wpAPI.wp.fiches.getById(id, {}, config).then(({ data }) => data)

    await dispatch('fetchRelatedRessources', [fiche])

    commit('SET_FICHE', fiche)
    return fiche
  },

  async fetchByCategoryIds(
    { dispatch, commit },
    // eslint-disable-next-line camelcase
    { category, location = null, search = null, criteria = [], page = 1, per_page = 10 }
  ) {
    const queryParams = {
      category,
      location,
      search,
    }

    criteria.forEach(({ taxonomy, values }) => {
      if (values.length) {
        queryParams[`filter[${taxonomy}]`] = values.join(',')
      }
    })

    Object.assign(queryParams, {
      page,
      per_page,
    })

    const { data: fiches, headers } = await this.$wpAPI.wp.fiches.get(queryParams)

    // fetch related ressources
    await dispatch('fetchRelatedRessources', fiches)

    commit('SET_FICHES', fiches)
    return { fiches, total: parseInt(headers['x-wp-total']), pages: parseInt(headers['x-wp-totalpages']) }
  },
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
}
