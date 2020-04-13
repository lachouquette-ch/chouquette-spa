import _ from 'lodash'

export const state = () => ({
  all: {}
})

export const actions = {
  async fetchByIds({ commit, state, dispatch }, ids) {
    const unknownMediaIds = _.difference(ids, Object.keys(state.all))
    const newMediaList = await this.$wpAPI.wp.media.getByIds(unknownMediaIds)
    commit('SET_MEDIA_LIST', newMediaList)

    return ids.map((id) => state.all[id])
  },
  async fetchById({ commit, state }, id) {
    if (state.all[id]) {
      return Promise.resolve(state.all[id])
    } else {
      const media = await this.$wpAPI.wp.media.getById(id)
      commit('SET_MEDIA', media)
      return media
    }
  }
}

export const mutations = {
  SET_MEDIA_LIST(state, mediaList) {
    mediaList.forEach((media) => (state.all[media.id] = media))
  },
  SET_MEDIA(state, media) {
    state.all[media.id] = media
  }
}
