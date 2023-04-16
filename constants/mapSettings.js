/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

export const Z_INDEXES = {
  default: 100,
  chouquettise: 500,
  selected: 1000,
}

export const ZOOM_LEVELS = {
  default: 15,
  activated: 20,
}

export const SWITZERLAND_BOUNDS = {
  north: 48.5744540832,
  south: 45.3980935767,
  west: 4.3880763722,
  east: 11.93019063,
}

export const LAUSANNE_LAT_LNG = {
  lat: 46.519962,
  lng: 6.633597,
}

export const MAP_STYLES = {
  featureType: 'poi.business',
  stylers: [{ visibility: 'off' }],
}

export const MAP_OPTIONS = {
  zoom: ZOOM_LEVELS.default,
  clickableIcons: false,
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  styles: MAP_STYLES,
  center: LAUSANNE_LAT_LNG,
  zoomControl: true,
}

export const CLUSTER_STYLES = [
  {
    width: 30,
    height: 30,
    className: 'clustericon',
  },
  {
    width: 40,
    height: 40,
    className: 'clustericon-chouquettise',
  },
]
