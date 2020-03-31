export const state = () => ({
  all: {}
})

export const actions = {
  async fetchMany({ commit, state }, ids) {
    const idList = ids.join(',')
    const mediaList = await this.$axios.$get(
      `${process.env.wpAPIBaseUrl}/media/?include=${idList}&per_page=${ids.length}&context=embed`
    )
    commit('setMediaList', mediaList)
    return mediaList
  },
  async get({ commit, state }, id) {
    if (state.all[id]) {
      return Promise.resolve(state.all[id])
    } else {
      const media = await this.$axios.$get(`${process.env.wpAPIBaseUrl}/media/${id}?context=embed`)
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
