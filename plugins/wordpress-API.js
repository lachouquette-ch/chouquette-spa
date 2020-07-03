import { wordpressEndpointFactory } from '~/api/wordpress/wordpress'

export default function ({ $axios }, inject) {
  // Create a custom axios instance
  const wpAxios = $axios.create()
  wpAxios.setBaseURL(`${process.env.wpBaseUrl}/wp-json`)
  // Create wordpress endpoints
  const wpEnpoints = wordpressEndpointFactory(wpAxios)

  // Inject to context as $wpAPI
  inject('wpAPI', wpEnpoints)
}
