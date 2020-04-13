const HEADER_SLUG = 'chouquette'
const FOOTER_SLUG = 'chouquette-footer'

export const state = () => ({
  header: null,
  headerCategories: [],

  footer: null,
  footerPages: []
})

export const actions = {
  async init({ commit }) {
    // fetch all menus
    const rawMenus = await this.$wpAPI.menus.get()
    // build menus with all dependencies
    const menus = await Promise.all(rawMenus.map((rawMenu) => this.$wpAPI.menus.getById(rawMenu.term_id)))

    const headerMenu = menus.find((menu) => menu.slug === HEADER_SLUG)
    commit('SET_HEADER', headerMenu)
    const footerMenu = menus.find((menu) => menu.slug === FOOTER_SLUG)
    commit('SET_FOOTER', footerMenu)

    return [headerMenu, footerMenu]
  }
}

export const mutations = {
  SET_HEADER(state, menu) {
    state.header = menu
    state.headerCategories = menu.items.filter(({ object }) => {
      return object === 'category'
    })
  },
  SET_FOOTER(state, menu) {
    state.footer = menu
    state.footerPages = menu.items.filter(({ object }) => {
      return object === 'page'
    })
  }
}
