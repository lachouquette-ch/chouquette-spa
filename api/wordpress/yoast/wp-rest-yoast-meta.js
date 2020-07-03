const prefix = '/wp-rest-yoast-meta/v1'

function yoastEndpointFactory($axios) {
  return {
    getRedirects() {
      return $axios.get(`${prefix}/redirects`)
    },
    getHome() {
      return $axios.get(`${prefix}/home`)
    },
  }
}

export { yoastEndpointFactory }
