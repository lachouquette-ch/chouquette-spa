export const state = () => ({})

export const actions = {
  /*async nuxtServerInit({ state, getters, dispatch }) {
    /!* Fetch Layout component data *!/

    // fetch menus
    await dispatch('menus/fetchAll')
    // fetch categories
    const menuCategories = [
      ...state.menus.header.items.filter((item) => item.object === 'category'),
      ...state.menus.footer.items.filter((item) => item.object === 'category')
    ]
    const menuCategoryIds = menuCategories.map(({object_id}) => object_id)
    const categories = await dispatch('categories/fetchMany', menuCategoryIds)
    // fetch medias
    const logoIds = categories.flatMap((category) => Object.values(category.acf.logos))
    await dispatch('media/fetchMany', logoIds)
  }*/
}
