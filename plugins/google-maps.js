import { Loader } from '@googlemaps/js-api-loader'

export default function ({ $config: { googleMapsKey } }, inject) {
  // Create google maps
  const googleMaps = new Loader({
    apiKey: googleMapsKey,
  })
    .load()
    .then((google) => google)
  inject('googleMaps', googleMaps)
}
