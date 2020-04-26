class Repository {
  constructor(resource, $axios) {
    this.$axios = $axios
    this.prefix = `/wp/v2/${resource}`
  }

  get(queryParams = {}) {
    return this.$axios.$get(this.prefix + '/', { params: queryParams })
  }

  getBySlug(slug, queryParams = {}) {
    queryParams = {
      slug,
      ...queryParams
    }
    return this.$axios.$get(this.prefix + '/', { params: queryParams }).then((posts) => posts[0])
  }

  getByIds(ids, queryParams = {}) {
    queryParams = {
      include: ids,
      per_page: ids.length,
      ...queryParams
    }
    return this.$axios.$get(this.prefix + '/', { params: queryParams })
  }

  getById(id, queryParams = {}) {
    const URI = `${this.prefix}/${id}?_embed=true`
    return this.$axios.$get(URI, { params: queryParams })
  }
}

export default Repository
