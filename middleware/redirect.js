export default function ({ store, route, redirect, error }) {
  // sitemap
  if (route.path === '/sitemap.xml') {
    redirect(307, `${process.env.wpBaseUrl}/sitemap.xml`)
  }

  // yoast redirection
  const redirection = store.state.yoast.redirects.find(({ from }) => route.path.startsWith(from))
  if (redirection) {
    /* eslint-disable indent */
    switch (redirection.status) {
      case 301:
      case 307:
        return redirect(redirection.status, redirection.to)
      case 410:
        error({ statusCode: redirection.status, message: `${redirection.to} n'existe plus sur le site` })
        break
      case 451:
        error({ statusCode: redirection.status, message: `${redirection.to} a dû être retirée du site` })
        break
      default:
        error({ statusCode: 500, message: `Impossible d'afficher la page '${redirection.to}' (${redirection.status})` })
    }
    /* eslint-enable indent */
  }
}
