import _ from 'lodash'

export const state = () => ({
  all: {},
  hierarchy: {},
  flatSorted: [],
})

export const actions = {
  init({ state, commit }, locations) {
    commit('SET_LOCATIONS', locations)

    return [locations, state.hierarchy]
  },

  getBySlug({ state }, slug) {
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
}

export const mutations = {
  SET_LOCATIONS(state, locations) {
    state.all = locations

    const topLocations = locations.filter(({ parentId }) => parentId === 0)
    // single level only. Add level property
    topLocations.forEach((location) => {
      location.level = 0
      const subLocations = locations.filter(({ parentId }) => parentId === parseInt(location.id))
      subLocations.forEach((subLocation) => (subLocation.level = 1))
      state.hierarchy[location.id] = subLocations
      // add to flatSorted
      state.flatSorted.push(location, ...subLocations)
    })
  },
}
