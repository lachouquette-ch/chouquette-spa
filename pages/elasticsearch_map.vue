<template>
  <div class="container layout-content my-3">
    <div ref="map" style="height: 50vh;" />
  </div>
</template>

<script>
import _ from 'lodash'
import MarkerClusterer from '@google/markerclustererplus'
import { CLUSTER_STYLES, MAP_OPTIONS, Z_INDEXES, ZOOM_LEVELS, LAUSANNE_LAT_LNG } from '~/constants/mapSettings'

export default {
  data() {
    return {
      map: null,
      markerClusterer: null,
      google: null,
      currentBounds: null,
    }
  },
  async mounted() {
    this.google = await this.$googleMaps
    this.map = new this.google.maps.Map(this.$refs.map, {
      ...MAP_OPTIONS,
      zoom: 9,
    })

    this.markerClusterer = new MarkerClusterer(this.map, [], {
      averageCenter: true,
      styles: CLUSTER_STYLES,
      calculator: (markers, clusterIconStylesCount) => {
        const index = markers.find((marker) => marker.chouquettise) ? 2 : 1
        const count = markers.reduce((accumulator, marker) => accumulator + marker.count, 0)
        return {
          index,
          text: count,
        }
      },
    })

    const fetchMarkersDebounce = _.debounce(() => this.fetchMarkers(), 1000, { trailing: true })
    const fetchMarkersThrottle = _.throttle(fetchMarkersDebounce, 2000)
    this.google.maps.event.addListener(this.map, 'idle', fetchMarkersThrottle)
  },
  methods: {
    async fetchMarkers() {
      console.log('fetchMarkers')
      // check if bounds is still the same
      const mapBounds = this.map.getBounds().toJSON()
      const mapZoom = this.map.getZoom()
      if (this.currentBounds && _.isEqual(mapBounds, this.currentBounds)) {
        console.log('same bounds')
        return
      }
      this.currentBounds = mapBounds

      const markers = await this.$esAPI.searchMarkers(mapBounds, mapZoom)
      console.log('markers count', markers.length)

      // add markers
      this.markerClusterer.clearMarkers()
      for (const marker of markers) {
        const gLatLng = new this.google.maps.LatLng(marker.coord.latitude, marker.coord.longitude)

        // eslint-disable-next-line no-new
        this.markerClusterer.addMarker(
          new this.google.maps.Marker({
            // icon: fiche.main_category.marker_icon,
            position: gLatLng,
            label: (marker.id || marker.count).toString(),
            count: marker.count,
            chouquettise: marker.chouquettise,
          })
        )
      }
      this.markerClusterer.fitMapToMarkers()
    },
  },
}
</script>

<style lang="scss" scoped></style>
