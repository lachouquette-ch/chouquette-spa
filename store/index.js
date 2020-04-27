export const state = () => ({
  name: null,
  description: null,
  url: null,
  home: null
})

export const actions = {
  async nuxtServerInit({ state, commit, dispatch }) {
    /* Fetch wordpress settings data */
    const settings = await this.$wpAPI._.$get()
    commit('SET_SETTINGS', settings)

    /* Fetch Layout component data */

    // fetch menus
    await dispatch('menus/init')
    // fetch locations
    await dispatch('locations/init')
    // fetch categories
    const menuCategoryIds = state.menus.headerCategories.map(({ object_id }) => object_id)
    await dispatch('categories/fetchByIds', menuCategoryIds)
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
