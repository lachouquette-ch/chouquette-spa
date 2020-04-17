import Repository from './repository'

class FicheRepository extends Repository {
  constructor($axios) {
    super('fiches', $axios)
  }

  postReport(postId, report) {
    const URI = `${this.prefix}/${postId}/report`
    return this.$axios.post(URI, report)
  }

  postMessage(postId, message) {
    return this.$axios.post(`/${postId}/message`, message)
  }
}

export default FicheRepository
