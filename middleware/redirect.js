export default function({ store, route, redirect }) {
  const redirection = store
    .dispatch('yoast/init')
    .then((redirects) => redirects.find(({ from }) => route.path.startsWith(from)))
  if (redirection) {
    redirect(redirection.status, redirection.to)
  }
}
