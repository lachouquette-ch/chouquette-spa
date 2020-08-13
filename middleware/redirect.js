export default function ({ store, route, redirect }) {
  // sitemap
  if (route.path === '/sitemap.xml') {
    redirect(307, `${process.env.wpBaseUrl}/sitemap.xml`)
  }

  // yoast redirection
  const redirection = store.state.yoast.redirects.find(({ from }) => route.path.startsWith(from))
  if (redirection) {
    return redirect(redirection.status, redirection.to)
  }
}
