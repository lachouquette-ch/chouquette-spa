import Vue from 'vue'
import moment from 'moment'

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
Vue.filter('momentDateTime', (dateTime, format = 'DD/MM/YY') => {
  const momentDate = moment(dateTime)
  return momentDate.format(format)
})
