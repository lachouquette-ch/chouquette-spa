const GoogleMapsApiLoader = require('google-maps-api-loader')

export default function (context, inject) {
  // Create google maps
  const googleMaps = GoogleMapsApiLoader({
    apiKey: process.env.googleMapsKey,
  })
  inject('googleMaps', googleMaps)
}
