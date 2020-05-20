export default function(req, res, next) {
  // req is the Node.js http request object
  if (req.headers.host.startsWith('www.')) {
    const redirectURL = 'https://' + req.headers.host.replace('www.', '') + req.url
    res.writeHead(307, { Location: redirectURL })
    return res.end()
  }

  next()
}
