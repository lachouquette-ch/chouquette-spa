import Repository from '~/api/elasticsearch/elasticsearch'

export default function ({ $axios, $config: { esBaseURL } }, inject) {
  // Create a custom axios instance
  const esAxios = $axios.create()
  esAxios.setBaseURL(`${esBaseURL}/`)
  // Create wordpress endpoint
  const esEnpoint = new Repository(esAxios)

  // Inject to context as $wpAPI
  inject('esAPI', esEnpoint)
}
