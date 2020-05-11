export const state = () => ({
  redirects: null,
  home: null
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
          status
        }
      })

      commit('SET_REDIRECTS', redirects)

      return redirects
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
  }
}

export const mutations = {
  SET_REDIRECTS(state, redirects) {
    state.redirects = redirects
  },
  SET_HOME(state, home) {
    state.home = home
  }
}
