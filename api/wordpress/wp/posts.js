import Repository from './repository'

class PostRepository extends Repository {
  static DEFAULT_FIELDS = ['id', 'slug', 'title', 'categories', 'top_categories', 'featured_media']

  constructor($axios) {
    super('posts', $axios)
  }

  get(queryParams = {}) {
    queryParams = {
      _fields: PostRepository.DEFAULT_FIELDS.join(','),
      ...queryParams
    }
    return super.get(queryParams)
  }

  getByIds(ids, queryParams = {}) {
    queryParams = {
      _fields: PostRepository.DEFAULT_FIELDS.join(','),
      ...queryParams
    }
    return super.getByIds(ids, queryParams)
  }

  getById(id, queryParams = {}) {
    queryParams = {
      _fields: PostRepository.DEFAULT_FIELDS.join(','),
      ...queryParams
    }
    return super.getById(id, queryParams)
  }

  getPreview(id, nonce) {
    const config = { withCredentials: true, headers: { 'X-WP-Nonce': nonce } }
    return super.getById(id, { _embed: true }, config)
  }
}

export default PostRepository
