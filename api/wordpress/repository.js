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

  getBySlug(slug) {
    const URI = `/?slug=${slug}&_embed=true`
    return this.axios.$get(URI).then((posts) => posts[0])
  }

  getByIds(ids) {
    const URI = `/?include=${ids.join(',')}&per_page=${ids.length}&_embed=true`
    return this.axios.$get(URI)
  }

  getById(id) {
    const URI = `/${id}?_embed=true`
    return this.axios.$get(URI)
  }
}

export default AbstractEndpoint
