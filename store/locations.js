import _ from 'lodash'
import { ressourceStates, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates(),
  hierarchy: {},
})

export const actions = {
  async init({ state, commit }) {
    if (!_.isEmpty(state.all)) {
      return [state.all, state.hierarchy]
    } else {
      // fetch all menus
      const locations = await this.$wpAPI.wp.locations
        .get({
          hide_empty: true,
          orderby: 'count',
          order: 'desc',
        })
        .then(({ data }) => data)
      commit('SET_LOCATIONS', locations)

      return [locations, state.hierarchy]
    }
  },

  fetchBySlug({ state }, slug) {
    const key = _.findKey(state.all, ({ slug: locationSlug }) => locationSlug === slug)
    if (key) {
      return state.all[key]
    } else {
      return null
    }
  },

  findChildren({ state }, location) {
    return state.hierarchy[location.id]
  },

  /**
   * Return an array with all locations sorted as a hierarchy
   */
  flatLocations({ state }) {
    const result = []
    for (const [parentId, children] of Object.entries(state.hierarchy)) {
      result.push(state.all[parentId], ...children)
    }
    return result
  },
}

export const mutations = {
  SET_LOCATIONS(state, locations) {
    ressourceMutations.setRessources(state, locations)

    const topLocations = locations.filter(({ parent }) => parent === 0)
    // single level only. Add level property
    topLocations.forEach((location) => {
      location.level = 0
      const subLocations = locations.filter(({ parent }) => parent === location.id)
      subLocations.forEach((subLocation) => (subLocation.level = 1))
      state.hierarchy[location.id] = subLocations
    })
  },
}
