import Repository from './repository'

class PostRepository extends Repository {
  constructor($axios) {
    super('pages', $axios)
  }

  getPreview(id, nonce) {
    return super.getById(id, {}, { withCredentials: true, headers: { 'X-WP-Nonce': nonce } })
  }
}

export default PostRepository
