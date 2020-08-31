export default function (context) {
  const { store, route } = context

  // yoast global redirection
  // only works from server-side since nuxtServerInit has been called already
  // for client-side must be implemented in each page
  if (process.server) {
    store.dispatch('yoast/redirect', { path: route.path, context })
  }
}
