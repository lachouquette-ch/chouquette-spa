export const Z_INDEXES = {
  default: 100,
  chouquettise: 500,
  selected: 1000
}

export const ZOOM_LEVELS = {
  default: 15,
  activated: 17
}

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
  zoom: ZOOM_LEVELS.default,
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

export const CLUSTER_STYLES = [
  {
    width: 30,
    height: 30,
    className: 'custom-clustericon-1'
  },
  {
    width: 40,
    height: 40,
    className: 'custom-clustericon-2'
  },
  {
    width: 50,
    height: 50,
    className: 'custom-clustericon-3'
  }
]

export const CLUSTER_CLASS = 'custom-clustericon'
