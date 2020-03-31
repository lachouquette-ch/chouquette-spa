import Repository from './repository'

const resource = '/media'

export default {
  getByIds(ids) {
    const URI = `${resource}/?include=${ids.join(',')}&per_page=${ids.length}&context=embed`
    return Repository.get(URI).then((response) => response.data)
  },
  getById(id) {
    const URI = `${resource}/${id}?context=embed`
    return Repository.get(URI).then((response) => response.data)
  }
}
