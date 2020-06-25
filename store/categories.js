import _ from 'lodash'
import { ressourceStates, ressourceActions, ressourceMutations } from './_ressource-helper'

export const state = () => ({
  ...ressourceStates(),
  hierarchy: {}
})

export const actions = {
  async fetchRelatedRessources({ state, dispatch, commit }, categories) {
    // fetch children
    const categoryChildren = categories.map(async (category) => {
      if (!state.hierarchy[category.id]) {
        const children = await this.$wpAPI.wp.categories.get({ parent: category.id }).then(({ data }) => data)
        commit('ADD_TO_HIERARCHY', { category, children })
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
  },

  findChildren({ state }, category) {
    return state.hierarchy[category.id]
  },

  flatCategories({ state }, categories) {
    return categories.flatMap((category) => [...state.hierarchy[category.id]])
  }
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    ressourceMutations.setRessources(state, categories)
  },
  SET_CATEGORY(state, category) {
    ressourceMutations.setRessource(state, category)
  },
  ADD_TO_HIERARCHY(state, { category, children }) {
    if (_.isEmpty(children)) {
      return
    }
    if (!state.hierarchy[category.id]) {
      category.level = 0
      children.forEach((subCategory) => (subCategory.level = 1))
      state.hierarchy[category.id] = children
    }
  }
}
