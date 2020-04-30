const prefix = '/chouquette/v1/criteria'

function criteriaEndpointFactory($axios) {
  return {
    getForFiche(id) {
      const URI = `${prefix}/fiche/${id}`
      return $axios.get(URI)
    },
    getForFiches(ids) {
      const URI = `${prefix}/fiche`
      return $axios.get(URI, {
        params: {
          include: ids.join(',')
        }
      })
    }
  }
}

export { criteriaEndpointFactory }
