const HEADER_SLUG = 'chouquette'
const FOOTER_SLUG = 'chouquette-footer'

export const state = () => ({
  header: null,
  headerCategories: [],

  footer: null,
  footerPages: []
})

export const actions = {
  async fetchAll({ state, commit, getters, dispatch }) {
    // fetch all menus
    const rawMenus = await this.$axios.$get('https://uat.lachouquette.ch/wp-json/menus/v1/menus/')
    // build menu with all dependencies
    const menus = await Promise.all(
      rawMenus.map((rawMenu) =>
        this.$axios.$get(`https://uat.lachouquette.ch/wp-json/menus/v1/menus/${rawMenu.term_id}`)
      )
    )

    const headerMenu = menus.find((menu) => menu.slug === HEADER_SLUG)
    commit('setHeader', headerMenu)
    const footerMenu = menus.find((menu) => menu.slug === FOOTER_SLUG)
    commit('setFooter', footerMenu)

    return [headerMenu, footerMenu]
  }
}

export const mutations = {
  setHeader(state, menu) {
    state.header = menu
    state.headerCategories = menu.items.filter(({ object }) => {
      return object === 'category'
    })
  },
  setFooter(state, menu) {
    state.footer = menu
    state.footerPages = menu.items.filter(({ object }) => {
      return object === 'page'
    })
  }
}
