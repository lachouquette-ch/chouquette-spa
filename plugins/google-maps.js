const GoogleMapsApiLoader = require('google-maps-api-loader')

export default function ({ $config: { googleMapsKey } }, inject) {
  // Create google maps
  const googleMaps = GoogleMapsApiLoader({
    apiKey: googleMapsKey,
  })
  inject('googleMaps', googleMaps)
}
