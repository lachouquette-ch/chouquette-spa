/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

export default {
  data() {
    return {
      shareApiAvailable: false,
    }
  },
  mounted() {
    this.shareApiAvailable = typeof navigator.share === 'function'
  },
  methods: {
    async shareWith(title, text, url) {
      try {
        return await navigator.share({ title, text, url })
      } catch (e) {
        // skip user abording share
        if (e instanceof DOMException && e.code === DOMException.ABORT_ERR) {
          console.log(e)
        } else {
          throw e
        }
      }
    },
  },
}
