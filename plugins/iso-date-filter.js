import Vue from 'vue'
import moment from 'moment'

/**
 * fromISO
 *
 * This filter renders a dateTime using moment.js
 *
 * @param dateTime Date object of time in ISO format
 * @param format the moment.js format to render
 *
 * @return String the date time
 */
Vue.filter('fromISO', (date, format = 'DD/MM/YY') => {
  return moment(date).format(format)
})
