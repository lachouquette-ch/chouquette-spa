import Repository from './repository'

const resource = '/criteria'

export default {
  getForFiche(id) {
    const URI = `${resource}/fiche/${id}`
    return Repository.get(URI).then((response) => response.data)
  }
}
