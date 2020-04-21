const prefix = '/chouquette/v1/contact'

function contactEndpointFactory($axios) {
  return {
    postMessage(message) {
      return $axios.$post(prefix, message)
    }
  }
}

export { contactEndpointFactory }
