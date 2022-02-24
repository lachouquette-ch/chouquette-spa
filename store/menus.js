const CATEGORIES_SLUG = 'categories'
const ABOUT_SLUG = 'a-propos'
const CONTACT_SLUG = 'nous-contacter'

export const state = () => ({
  all: {},
})

export const actions = {
  async init({ state, commit }, menus) {
    /* Process header menu */
    const result = menus.map((menu) => {
      const filteredItems = menu.items.filter((item) => ['page', 'category'].includes(item.type))
      return { name: menu.name, slug: menu.slug, items: filteredItems }
    })
    await commit('SET_MENUS', result)

    return result
  },

  /**
   * Return an array with all hleader categories and subcategories
   */
  getHeaderCategories({ state }) {
    return state.headerCategories.map((headerCategoryId) => this.getters['categories/getById'](headerCategoryId))
  },
}

export const getters = {
  getCategoryMenu: (state) => state.all[CATEGORIES_SLUG],
  getAboutMenu: (state) => state.all[ABOUT_SLUG],
  getContactMenu: (state) => state.all[CONTACT_SLUG],
}

export const mutations = {
  SET_MENUS(state, menus) {
    menus.forEach((menu) => {
      state.all[menu.slug] = menu
    })
  },
}
