import MediaAPI from '~/api/wordpress/media'

export const state = () => ({
  all: {}
})

export const actions = {
  async fetchByIds({ commit, state }, ids) {
    const mediaList = await MediaAPI.getByIds(ids)
    commit('SET_MEDIA_LIST', mediaList)
    return mediaList
  },
  async fetchById({ commit, state }, id) {
    if (state.all[id]) {
      return Promise.resolve(state.all[id])
    } else {
      const media = await MediaAPI.getById(id)
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
