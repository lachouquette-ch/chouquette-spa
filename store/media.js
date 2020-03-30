export const state = () => ({
  all: {}
})

export const actions = {
  async fetchMany({ commit, state }, ids) {
    const idList = ids.join(',')
    const mediaList = await this.$axios.$get(
      `https://uat.lachouquette.ch/wp-json/wp/v2/media/?include=${idList}&context=embed`
    )
    commit('setMediaList', mediaList)
    return mediaList
  },
  async getSingle({ commit, state }, id) {
    if (state[id]) {
      return Promise.resolve(state[id])
    } else {
      const media = await this.$axios.$get(`https://uat.lachouquette.ch/wp-json/wp/v2/media/${id}?context=embed`)
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
