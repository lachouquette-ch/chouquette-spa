/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

export const state = () => ({
  redirects: null,
  home: null,
})

export const actions = {
  init({ state, commit }, redirects) {
    commit('SET_REDIRECTS', redirects)
    return redirects
  },

  redirect({ state }, { path, context, fallback }) {
    const redirection = state.redirects.find(({ from }) => path.startsWith(from))
    if (redirection) {
      /* eslint-disable indent */
      switch (redirection.status) {
        case 301:
        case 307:
          return context.redirect(redirection.status, redirection.to)
        case 410:
          context.error({ statusCode: redirection.status, message: `${redirection.to} n'existe plus sur le site` })
          break
        case 451:
          context.error({ statusCode: redirection.status, message: `${redirection.to} a dû être retirée du site` })
          break
        default:
          context.error({
            statusCode: 500,
            message: `Impossible d'afficher la page '${redirection.to}' (${redirection.status})`,
          })
      }
      /* eslint-enable indent */
    } else if (fallback) {
      context.error(fallback)
    } else {
      return null
    }
  },

  async fetchHome({ state, commit }) {
    if (state.home) {
      return state.home
    } else {
      const home = await this.$wpAPI.yoast.getHome().then(({ data }) => data)
      commit('SET_HOME', home)

      return home
    }
  },
}

export const mutations = {
  SET_REDIRECTS(state, redirects) {
    state.redirects = redirects
  },
  SET_HOME(state, home) {
    state.home = home
  },
}
