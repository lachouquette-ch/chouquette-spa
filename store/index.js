export const state = () => ({
  name: null,
  description: null,
  url: null,
  home: null
})

export const actions = {
  async nuxtServerInit({ state, commit, dispatch }) {
    /* Fetch wordpress settings data */
    const settings = await this.$wpAPI._.get().then(({ data }) => data)
    commit('SET_SETTINGS', settings)

    /* Fetch yoast redirect */
    await dispatch('yoast/init')

    /* Fetch Layout component data */

    // fetch menus
    await dispatch('menus/init')
    // fetch locations
    await dispatch('locations/init')
  }
}

export const mutations = {
  SET_SETTINGS(state, { name, description, url, home }) {
    state.name = name
    state.description = description
    state.url = url
    state.home = home
  }
}
