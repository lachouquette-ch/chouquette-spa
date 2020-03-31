import Repository from './repository'

const resource = '/menus'

export default {
  get() {
    return Repository.get(resource).then((response) => response.data)
  },
  getById(id) {
    const URI = `${resource}/${id}`
    return Repository.get(URI).then((response) => response.data)
  }
}
