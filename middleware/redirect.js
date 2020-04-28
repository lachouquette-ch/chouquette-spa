export default function({ store, route, redirect }) {
  const redirection = store.state.yoast.redirects.find(({ from }) => route.path.startsWith(from))
  if (redirection) {
    redirect(redirection.status, redirection.to)
  }
}
