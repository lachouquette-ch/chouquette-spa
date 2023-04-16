/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
