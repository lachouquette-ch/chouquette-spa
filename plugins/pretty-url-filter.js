import Vue from 'vue'

const PRETTY_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?(.+?)\/*?$/i

/**
 * prettyURL
 *
 * This filter removes all unnecessary data (from a user point of view) : protocol and leading 'www' of a URL
 *
 * @param String the URL
 *
 * @return String the prettier URL
 */
Vue.filter('prettyURL', (url) => {
  return url.replace(PRETTY_URL_REGEX, '$1')
})
