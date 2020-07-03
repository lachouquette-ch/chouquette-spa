const prefix = '/chouquette/v1/criteria'

function criteriaEndpointFactory($axios) {
  return {
    getForFiche(ficheId) {
      const URI = `${prefix}/fiche/${ficheId}`
      return $axios.get(URI)
    },
    getForFiches(ficheIds) {
      const URI = `${prefix}/fiche`
      return $axios.get(URI, {
        params: {
          include: ficheIds.join(','),
        },
      })
    },
    getForCategory(categoryId) {
      const URI = `${prefix}/category/${categoryId}`
      return $axios.get(URI)
    },
  }
}

export { criteriaEndpointFactory }
