import Vue from 'vue'
import he from 'he'

/**
 * momentDateTime
 *
 * This filter renders a dateTime using moment.js
 *
 * @param dateTime Date object of time in milliseconds
 * @param format the moment.js format to render
 *
 * @return String the date time
 */
Vue.filter('heDecode', (text) => {
  return he.decode(text)
})
