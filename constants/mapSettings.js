export const ZOOM_LEVEL_DEFAULT = 15
export const ZOOM_LEVEL_ACTIVED = 17

export const SWITZERLAND_BOUNDS = {
  north: 48.5744540832,
  south: 45.3980935767,
  west: 4.3880763722,
  east: 11.93019063
}

export const MAP_STYLES = {
  featureType: 'poi.business',
  stylers: [{ visibility: 'off' }]
}

export const MAP_OPTIONS = {
  zoom: ZOOM_LEVEL_DEFAULT,
  clickableIcons: false,
  disableDefaultUI: true,
  fullscreenControl: true,
  gestureHandling: 'greedy',
  restriction: {
    latLngBounds: SWITZERLAND_BOUNDS,
    strictBounds: false
  },
  styles: MAP_STYLES,
  center: {
    lat: 46.519962,
    lng: 6.633597
  },
  zoomControl: true
}