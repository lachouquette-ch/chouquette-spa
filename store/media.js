import MediaAPI from '~/api/wordpress/media'

export const state = () => ({
  all: {}
})

export const actions = {
  async fetchMany({ commit, state }, ids) {
    const mediaList = await MediaAPI.getByIds(ids)
    commit('setMediaList', mediaList)
    return mediaList
  },
  async get({ commit, state }, id) {
    if (state.all[id]) {
      return Promise.resolve(state.all[id])
    } else {
      const media = await MediaAPI.getById(id)
      commit('setMedia', media)
      return media
    }
  }
}

export const mutations = {
  setMediaList(state, mediaList) {
    mediaList.forEach((media) => (state.all[media.id] = media))
  },
  setMedia(state, media) {
    state.all[media.id] = media
  }
}
