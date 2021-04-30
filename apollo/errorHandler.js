export default ({ graphQLErrors, networkError, operation, forward }, nuxtContext) => {
  // TODO : call sentry ?
  console.log('Global error handler')
  console.log(graphQLErrors, networkError, operation, forward)
  console.log(nuxtContext)
}
