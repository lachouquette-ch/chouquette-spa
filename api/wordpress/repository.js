// TODO use @nuxtjs/axios instead. Maybe using https://axios.nuxtjs.org/extend.html
import axios from 'axios'

class AbstractEndpoint {
  static create(resource) {
    return new AbstractEndpoint(resource)
  }

  constructor(resource) {
    this.axios = axios.create({
      baseURL: `${process.env.wpBaseUrl}/wp-json/wp/v2/${resource}`
    })
    this.axios.$get = (...args) => {
      return this.axios.get.apply(this, args).then((response) => response.data)
    }
  }

  get(...args) {
    return this.axios.$get.apply(this, args)
  }

  getBySlug(slug) {
    const params = {
      slug,
      _embed: true
    }
    return this.axios.$get('/', { params }).then((posts) => posts[0])
  }

  getByIds(ids) {
    const params = {
      include: ids,
      per_page: ids.length,
      _embed: true
    }
    return this.axios.$get('/', { params })
  }

  getById(id) {
    const URI = `/${id}?_embed=true`
    return this.axios.$get(URI)
  }
}

export default AbstractEndpoint
