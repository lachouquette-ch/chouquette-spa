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
  fullscreenControl: true,
  gestureHandling: 'greedy',
  restriction: {
    latLngBounds: SWITZERLAND_BOUNDS,
    strictBounds: false,
  },
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
