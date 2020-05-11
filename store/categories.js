import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates(),
  children: {}
})

export const actions = {
  async fetchRelatedRessources({ state, dispatch, commit }, categories) {
    // fetch children
    const categoryChildren = categories.map(async (category) => {
      if (!state.children[category.id]) {
        const children = await this.$wpAPI.wp.categories.get({ parent: category.id }).then(({ data }) => data)
        commit('SET_CHILDREN', { category, children })
      }
    })

    // fetch category logos
    const mediaIds = categories.flatMap(({ logos }) => Object.values(logos))

    await Promise.all([...categoryChildren, dispatch('media/fetchByIds', mediaIds, { root: true })])
  },

  async fetchByIds(context, ids) {
    return await ressourceActions.fetchByIds(this.$wpAPI.wp.categories, 'SET_CATEGORIES', context, ids)
  },

  async fetchById(context, id) {
    return await ressourceActions.fetchById(this.$wpAPI.wp.categories, 'SET_CATEGORY', context, id)
  },

  async fetchBySlug(context, slug) {
    return await ressourceActions.fetchBySlug(this.$wpAPI.wp.categories, 'SET_CATEGORY', context, slug)
  }
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    ressourceMutations.setRessources(state, categories)
  },
  SET_CATEGORY(state, category) {
    ressourceMutations.setRessource(state, category)
  },
  SET_CHILDREN(state, { category, children }) {
    state.children[category.id] = children
  }
}
