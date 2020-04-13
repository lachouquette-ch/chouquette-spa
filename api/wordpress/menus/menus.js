const prefix = '/menus/v1'

function menusEndpointFactory($axios) {
  return {
    get() {
      return $axios.$get(`${prefix}/menus`)
    },
    getById(id) {
      const URI = `${prefix}/menus/${id}`
      return $axios.$get(URI)
    }
  }
}

export { menusEndpointFactory }
