import Repository from './repository'

class MediaRepository extends Repository {
  static DEFAULT_FIELDS = ['alt_text', 'caption', 'id', 'media_details', 'mime_type', 'slug', 'source_url']

  constructor($axios) {
    super('media', $axios)
  }

  get(queryParams = {}) {
    queryParams = {
      _fields: MediaRepository.DEFAULT_FIELDS.join(','),
      ...queryParams,
    }
    return super.get(queryParams)
  }

  getByIds(ids, queryParams = {}) {
    queryParams = {
      _fields: MediaRepository.DEFAULT_FIELDS.join(','),
      ...queryParams,
    }
    return super.getByIds(ids, queryParams)
  }

  getById(id, queryParams = {}) {
    queryParams = {
      _fields: MediaRepository.DEFAULT_FIELDS.join(','),
      ...queryParams,
    }
    return super.getById(id, queryParams)
  }
}

export default MediaRepository
