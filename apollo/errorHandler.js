export default ({ graphQLErrors, networkError }, { store }) => {
  // TODO : call sentry ?
  if (networkError) {
    store.dispatch('alerts/addAction', {
      type: 'danger',
      message: `Erreur lors du chargement des données : ${networkError.statusCode} ${networkError.name}`,
    })
  } else if (graphQLErrors) {
    const errors = graphQLErrors.map(({ path, message }) => `${path.join(',')} (${message})`)
    store.dispatch('alerts/addAction', {
      type: 'danger',
      message: `Erreur(s) lors du chargement des données : ${errors.join(' - ')}`,
    })
  }
}
