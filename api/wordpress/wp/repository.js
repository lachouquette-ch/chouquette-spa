class Repository {
  constructor(resource, $axios) {
    this.$axios = $axios
    this.prefix = `/wp/v2/${resource}`
  }

  get(params) {
    return this.$axios.$get(this.prefix + '/', params)
  }

  getBySlug(slug) {
    const params = {
      slug,
      _embed: true
    }
    return this.$axios.$get(this.prefix + '/', { params }).then((posts) => posts[0])
  }

  getByIds(ids) {
    const params = {
      include: ids,
      per_page: ids.length,
      _embed: true
    }
    return this.$axios.$get(this.prefix + '/', { params })
  }

  getById(id) {
    const URI = `${this.prefix}/${id}?_embed=true`
    return this.$axios.$get(URI)
  }
}

export default Repository
