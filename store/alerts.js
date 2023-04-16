/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

export const state = () => ({
  all: [],
})

const AlertType = ['success', 'info', 'warning', 'error']

export const actions = {
  addAction({ commit, state, dispatch }, alert) {
    const { type } = alert
    if (!AlertType.includes(type)) {
      // eslint-disable-next-line no-console
      console.error(`Unkown alert type '${type}'`)
      return
    }

    commit('SET_ALERT', alert)

    setTimeout(() => {
      dispatch('removeAction', alert)
    }, 5000)
  },
  removeAction({ commit, state }, alert) {
    const index = state.all.findIndex((el) => el.type === alert.type && el.message === alert.message)
    commit('REMOVE_ALERT', index)
  },
}

export const mutations = {
  SET_ALERT(state, alert) {
    state.all.push(alert)
  },
  REMOVE_ALERT(state, index) {
    state.all.splice(index, 1)
  },
}
