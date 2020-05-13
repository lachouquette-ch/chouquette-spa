import _ from 'lodash'
import { ressourceStates, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates(),
  hierarchy: []
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
          order: 'desc'
        })
        .then(({ data }) => data)
      commit('SET_LOCATIONS', locations)

      return [locations, state.hierarchy]
    }
  }
}

export const mutations = {
  SET_LOCATIONS(state, locations) {
    ressourceMutations.setRessources(state, locations)

    const topLocations = locations.filter(({ parent }) => parent === 0)
    // single level only. Add level property
    state.hierarchy = topLocations.map((location) => {
      location.level = 0
      const subLocations = locations.filter(({ parent }) => parent === location.id)
      subLocations.forEach((subLocation) => (subLocation.level = 1))
      return {
        location,
        subLocations
      }
    })
  }
}
