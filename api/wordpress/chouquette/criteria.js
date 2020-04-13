const prefix = '/chouquette/v1/criteria'

function criteriaEndpointFactory($axios) {
  return {
    getForFiche(id) {
      const URI = `${prefix}/fiche/${id}`
      return $axios.$get(URI)
    }
  }
}

export { criteriaEndpointFactory }
