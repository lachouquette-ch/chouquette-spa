export const state = () => ({
  redirects: []
})

export const actions = {
  async init({ commit }) {
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

    return [redirects]
  }
}

export const mutations = {
  SET_REDIRECTS(state, redirects) {
    state.redirects = redirects
  }
}
