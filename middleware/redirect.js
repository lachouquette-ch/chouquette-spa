export default function ({ store, route, redirect }) {
  // sitemap
  if (route.path === '/sitemap.xml') {
    redirect(307, `${process.env.wpBaseUrl}/sitemap.xml`)
  }

  // yoast redirection
  const redirection = store
    .dispatch('yoast/init')
    .then((redirects) => redirects.find(({ from }) => route.path.startsWith(from)))
  if (redirection) {
    redirect(redirection.status, redirection.to)
  }
}
