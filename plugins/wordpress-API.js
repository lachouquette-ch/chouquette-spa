import { wordpressEndpointFactory } from '~/api/wordpress/wordpress'

export default function ({ $axios, $config: { wpBaseURL } }, inject) {
  // Create a custom axios instance
  const wpAxios = $axios.create()
  wpAxios.setBaseURL(`${wpBaseURL}/wp-json`)
  // Create wordpress endpoints
  const wpEnpoints = wordpressEndpointFactory(wpAxios)

  // Inject to context as $wpAPI
  inject('wpAPI', wpEnpoints)
}
