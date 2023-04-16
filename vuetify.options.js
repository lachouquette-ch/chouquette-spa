/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import fr from 'vuetify/lib/locale/fr'

export default {
  breakpoint: {
    mobileBreakpoint: 'xs', // This is equivalent to a value of 960
  },
  icons: {},
  lang: {
    locales: { fr },
    current: 'fr',
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#3D3B3C',
        secondary: '#9E9696',
        'cq-yellow': '#EFE407',
        'cq-blue': '#8DE3CE',
        'cq-blue-light': '#C5F9F5',
        'cq-red': '#D99056',
        'cq-red-light': '#F8B999',
        'cq-grey': '#3D3B3C',
        'cq-grey-light': '#9E9696',
        'cq-beige': '#F5F0EA',
        background: '#FFFFFF',
      },
      dark: {
        primary: '#8DE3CE',
        secondary: '#EFE407',
        background: '#3D3B3C',
      },
    },
  },
}
