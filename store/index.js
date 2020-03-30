export const state = () => ({})

export const actions = {
  async nuxtServerInit({ state, getters, dispatch }) {
    /* Fetch Layout component data */

    // fetch menus
    await dispatch('menus/fetchAll')
    // fetch categories
    const menuCategoryIds = state.menus.headerCategories.map(({ object_id }) => object_id)
    const categories = await dispatch('categories/fetchMany', menuCategoryIds)
    // fetch medias
    const logoIds = categories.flatMap((category) => Object.values(category.acf.logos))
    await dispatch('media/fetchMany', logoIds)
  }
}
