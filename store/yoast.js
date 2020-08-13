export const state = () => ({
  redirects: null,
  home: null,
})

export const actions = {
  async init({ state, commit }) {
    if (state.redirects) {
      return state.redirects
    } else {
      // fetch all redirections
      const rawRedirects = await this.$wpAPI.yoast.getRedirects().then(({ data }) => data)

      const redirects = rawRedirects.map((redirect) => {
        const [from, to, status] = redirect.split(' ')
        return {
          from: from.replace(/\/$/, ''),
          to: to.replace(/\/$/, ''),
          status: parseInt(status),
        }
      })

      commit('SET_REDIRECTS', redirects)

      return redirects
    }
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
