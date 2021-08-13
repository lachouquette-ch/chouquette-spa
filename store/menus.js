const HEADER_SLUG = 'chouquette'
const FOOTER_SLUG = 'chouquette-footer'

export const state = () => ({
  header: null,
  headerCategories: [],
  selectedCategory: null,

  footer: null,
  footerPages: [],
})

export const actions = {
  async init({ state, commit, dispatch, rootGetters }, menus) {
    /* Process header menu */
    // get menu and add to store
    const headerMenu = menus.find((menu) => menu.slug === HEADER_SLUG)
    commit('SET_HEADER', headerMenu)
    // filter categories, get and store
    const categories = await Promise.all(
      headerMenu.items
        .filter(({ type }) => {
          return type === 'category'
        })
        .map(({ id }) => {
          return rootGetters['categories/getById'](parseInt(id))
        })
    )
    commit('SET_HEADER_CATEGORIES', categories)

    const footerMenu = menus.find((menu) => menu.slug === FOOTER_SLUG)
    commit('SET_FOOTER', footerMenu)

    return [headerMenu, footerMenu]
  },

  setSelectedCategory({ commit }, category) {
    commit('SET_SELECTED_CATEGORY', category)
  },

  clearSelectedCategory({ commit }) {
    commit('UNSET_SELECTED_CATEGORY')
  },

  /**
   * Return an array with all hleader categories and subcategories
   */
  getHeaderCategories({ state, dispatch }) {
    return state.headerCategories.map((headerCategoryId) =>
      dispatch('categories/get', headerCategoryId, { root: true })
    )
  },
}

export const mutations = {
  SET_HEADER(state, menu) {
    state.header = menu
  },
  SET_HEADER_CATEGORIES(state, categories) {
    state.headerCategories = categories
  },
  SET_FOOTER(state, menu) {
    state.footer = menu
    state.footerPages = menu.items.filter(({ type }) => {
      return type === 'page'
    })
  },
  SET_SELECTED_CATEGORY(state, category) {
    const selectedCategory = state.headerCategories.find((headerCategory) => headerCategory.id === category.id)
    if (!selectedCategory) {
      throw new Error(`Couldn't find ${category.name} in header`)
    }
    state.selectedCategory = selectedCategory
  },
  UNSET_SELECTED_CATEGORY(state) {
    state.selectedCategory = null
  },
}
