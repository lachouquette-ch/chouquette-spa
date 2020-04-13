import { wpEndpointFactory } from '~/api/wordpress/wp/wp'
import { menusEndpointFactory } from '~/api/wordpress/menus/menus'
import { criteriaEndpointFactory } from '~/api/wordpress/chouquette/criteria'

function wordpressEndpointFactory($axios) {
  return {
    wp: wpEndpointFactory($axios),
    menus: menusEndpointFactory($axios),
    criteria: criteriaEndpointFactory($axios),
    _: $axios
  }
}

export { wordpressEndpointFactory }
