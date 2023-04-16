/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
}

export const getters = {
  getBySlug: (state) => (slug) => {
    const key = _.findKey(state.all, ({ slug: locationSlug }) => locationSlug === slug)
    if (key) {
      return state.all[key]
    } else {
      return null
    }
  },

  getById: (state) => (id) => {
    return state.all[id]
  },

  getChildren: (state) => (location) => {
    return state.hierarchy[location.id]
  },
}

export const mutations = {
  SET_LOCATIONS(state, locations) {
    state.all = locations.reduce((acc, location) => {
      acc[parseInt(location.id)] = location
      return acc
    }, {})

    const topLocations = locations.filter(({ parentId }) => parentId === 0)
    // single level only. Add level property
    topLocations.forEach((location) => {
      location.level = 0
      const subLocations = locations.filter(({ parentId }) => parentId === parseInt(location.id))
      subLocations.forEach((subLocation) => (subLocation.level = 1))
      state.hierarchy[parseInt(location.id)] = subLocations
      // add to flatSorted
      state.flatSorted.push(location, ...subLocations)
    })
  },
}
