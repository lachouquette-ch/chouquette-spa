/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
