class Repository {
  constructor(resource, $axios) {
    this.$axios = $axios
    this.prefix = `/wp/v2/${resource}`
  }

  get(queryParams = {}) {
    return this.$axios.get(this.prefix + '/', { params: queryParams })
  }

  getBySlug(slug, queryParams = {}) {
    queryParams = {
      slug,
      ...queryParams,
    }
    return this.$axios.get(this.prefix + '/', { params: queryParams })
  }

  getByIds(ids, queryParams = {}) {
    queryParams = {
      include: ids.join(','),
      per_page: ids.length,
      ...queryParams,
    }
    return this.$axios.get(this.prefix + '/', { params: queryParams })
  }

  getById(id, queryParams = {}, config = {}) {
    const URI = `${this.prefix}/${id}?_embed=true`
    return this.$axios.get(URI, { params: queryParams, ...config })
  }
}

export default Repository
