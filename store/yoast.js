export const state = () => ({
  redirects: null,
  home: null,
})

export const actions = {
  init({ state, commit }, redirects) {
    commit('SET_REDIRECTS', redirects)
    return redirects
  },

  redirect({ state }, { path, context }) {
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
    }
    return null
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
