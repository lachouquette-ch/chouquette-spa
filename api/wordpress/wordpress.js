import { wpEndpointFactory } from '~/api/wordpress/wp/wp'
import { menusEndpointFactory } from '~/api/wordpress/menus/menus'
import { criteriaEndpointFactory } from '~/api/wordpress/chouquette/criteria'
import { contactEndpointFactory } from '~/api/wordpress/chouquette/contact'
import { yoastEndpointFactory } from '~/api/wordpress/yoast/wp-rest-yoast-meta'

function wordpressEndpointFactory($axios) {
  return {
    wp: wpEndpointFactory($axios),
    menus: menusEndpointFactory($axios),
    criteria: criteriaEndpointFactory($axios),
    contact: contactEndpointFactory($axios),
    yoast: yoastEndpointFactory($axios),
    _: $axios,
  }
}

export { wordpressEndpointFactory }
