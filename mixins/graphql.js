export default {
  methods: {
    parseGQLError({ graphQLErrors, networkError, ...err }) {
      if (networkError) {
        return `${networkError.statusCode} ${networkError.name}`
      } else if (graphQLErrors) {
        const errors = graphQLErrors.map(({ path, message }) => `${path.join(',')} (${message})`)
        return errors.join(' - ')
      } else {
        return err
      }
    },
    handleGQLError(error, prefix = 'Erreur lors du chargement des données') {
      this.$store.dispatch('alerts/addAction', {
        type: 'error',
        message: `${prefix} ${this.parseGQLError(error)}`,
      })
    },
  },
}
