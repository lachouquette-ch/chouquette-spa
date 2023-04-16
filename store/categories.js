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
  topLevels: [],
})

export const getters = {
  getTopLevels: (state) => {
    return Object.values(state.all).filter((category) => category.parentId === 0)
  },

  getById: (state) => (id) => {
    return state.all[id]
  },

  getBySlug: (state) => (slug) => {
    return Object.values(state.all).find((category) => category.slug === slug)
  },

  getChildrenForId: (state) => (parentId) => {
    return state.hierarchy[parentId]
  },
}

export const actions = {
  init({ state, commit, dispatch }, categories) {
    commit('SET_CATEGORIES', categories)
    return categories
  },
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    // add top levels
    _.merge(
      state.hierarchy,
      categories
        .filter(({ parentId }) => parentId === 0)
        .reduce((acc, category) => {
          acc[category.id] = []
          return acc
        }, {})
    )
    // build all and append children to top levels
    for (const category of categories) {
      // setup level
      category.level = category.parentId ? 1 : 0
      // add to all categories
      state.all[category.id] = category
      // setup category if not root category
      if (category.parentId === 0) {
        state.topLevels.push(category)
      } else {
        state.hierarchy[category.parentId]
          ? state.hierarchy[category.parentId].push(category)
          : console.warn(`No parent category for ${category.slug} (${category.id}). 3rd level category ?`)
      }
    }
  },
}
