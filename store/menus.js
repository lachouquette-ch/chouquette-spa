/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
