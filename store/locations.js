import { ressourceStates, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates(),
  hierarchy: []
})

export const actions = {
  async init({ commit }) {
    // fetch all menus
    const locations = await this.$wpAPI.wp.locations
      .get({
        hide_empty: true,
        orderby: 'count',
        order: 'desc'
      })
      .then(({ data }) => data)
    commit('SET_LOCATIONS', locations)

    return locations
  }
}

export const mutations = {
  SET_LOCATIONS(state, locations) {
    ressourceMutations.setRessources(state, locations)

    const topLocations = locations.filter(({ parent }) => parent === 0)
    // single level only. Add level property
    state.hierarchy = topLocations.map((topLocation) => {
      return {
        location: { ...topLocation, level: 0 },
        subLocations: locations
          .filter(({ parent }) => parent === topLocation.id)
          .map((subLocation) => {
            return { ...subLocation, level: 1 }
          })
      }
    })
  }
}
