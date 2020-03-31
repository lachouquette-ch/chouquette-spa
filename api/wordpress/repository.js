import axios from 'axios'

class AbstractEndpoint {
  static create(resource) {
    return new AbstractEndpoint(resource)
  }

  constructor(resource) {
    this.resource = resource
    this.axios = axios.create({
      baseURL: `${process.env.wpBaseUrl}/wp-json/wp/v2/${resource}`
    })
  }

  getBySlug(slug) {
    const URI = `?slug=${slug}&_embed=true`
    return this.axios.get(URI).then((response) => response.data[0])
  }

  getByIds(ids) {
    const URI = `/?include=${ids.join(',')}&per_page=${ids.length}&_embed=true`
    return this.axios.get(URI).then((response) => response.data)
  }

  getById(id) {
    const URI = `/${id}?_embed=true`
    return this.axios.get(URI).then((response) => response.data)
  }
}

export default AbstractEndpoint
