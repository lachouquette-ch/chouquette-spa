const HEADER_SLUG = 'chouquette'
const FOOTER_SLUG = 'chouquette-footer'

export const state = () => ({
  header: null,
  headerCategories: [],

  footer: null,
  footerPages: []
})

export const actions = {
  async init({ commit, dispatch }) {
    // fetch all menus
    const rawMenus = await this.$wpAPI.menus.get().then(({ data }) => data)
    // build menus with all dependencies
    const menus = await Promise.all(
      rawMenus.map((rawMenu) => this.$wpAPI.menus.getById(rawMenu.term_id).then(({ data }) => data))
    )

    /* Process header menu */
    // get menu and add to store
    const headerMenu = menus.find((menu) => menu.slug === HEADER_SLUG)
    commit('SET_HEADER', headerMenu)
    // filter categories, fetch and store
    const categoryItems = headerMenu.items.filter(({ object }) => {
      return object === 'category'
    })
    const categoryIds = categoryItems.map(({ object_id }) => object_id)
    const categories = await dispatch('categories/fetchByIds', categoryIds, { root: true })
    commit('SET_HEADER_CATEGORIES', categories)

    const footerMenu = menus.find((menu) => menu.slug === FOOTER_SLUG)
    commit('SET_FOOTER', footerMenu)

    return [headerMenu, footerMenu]
  }
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
    state.footerPages = menu.items.filter(({ object }) => {
      return object === 'page'
    })
  }
}
