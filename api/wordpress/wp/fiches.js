import Repository from './repository'

class FicheRepository extends Repository {
  constructor($axios) {
    super('fiches', $axios)
  }

  postReport(postId, report) {
    const URI = `${this.prefix}/${postId}/report`
    return this.$axios.post(URI, report)
  }

  postContact(postId, message) {
    const URI = `${this.prefix}/${postId}/contact`
    return this.$axios.post(URI, message)
  }
}

export default FicheRepository
