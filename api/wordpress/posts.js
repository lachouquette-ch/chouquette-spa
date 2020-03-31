import Repository from './repository'

const resource = '/posts'

export default {
  getBySlug(slug) {
    const URI = `${resource}?slug=${slug}&_embed=true`
    return Repository.get(URI).then((response) => response.data[0])
  }
}
