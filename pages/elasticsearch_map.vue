<template>
  <div class="container layout-content my-3">
    <div ref="map" style="height: 50vh;" />
    {{ markers }}
  </div>
</template>

<script>
import _ from 'lodash'
import { CLUSTER_STYLES, MAP_OPTIONS, Z_INDEXES, ZOOM_LEVELS, LAUSANNE_LAT_LNG } from '~/constants/mapSettings'

export default {
  data() {
    return {
      markers: [],
      gMarkers: [],
      map: null,
      google: null,
      currentBounds: null,
    }
  },
  async mounted() {
    this.google = await this.$googleMaps
    this.map = new this.google.maps.Map(this.$refs.map, {
      ...MAP_OPTIONS,
      zoom: 21,
    })

    const boundsThrottle = _.throttle(() => this.fetchMarkers(), 1000)
    const boundsDebounce = _.debounce(boundsThrottle, 1000)
    this.map.addListener('tilesloaded', () => {
      setTimeout(boundsDebounce, 500)
    })
  },
  methods: {
    async fetchMarkers() {
      // check if bounds is still the same
      const mapBounds = this.map.getBounds().toJSON()
      const mapZoom = this.map.getZoom()
      if (this.currentBounds && _.isEqual(mapBounds, this.currentBounds)) {
        console.log('same bounds')
        return
      }
      this.currentBounds = mapBounds

      this.markers = await this.$esAPI.searchMarkers(mapBounds, mapZoom)
      console.log('markers count', this.markers.length)

      // add markers
      const gBounds = new this.google.maps.LatLngBounds()
      this.gMarkers.forEach((gMarker) => gMarker.setMap(null))
      this.gMarkers = []
      for (const marker of this.markers) {
        const gLatLng = new this.google.maps.LatLng(marker.coord.latitude, marker.coord.longitude)

        // eslint-disable-next-line no-new
        this.gMarkers.push(
          new this.google.maps.Marker({
            // icon: fiche.main_category.marker_icon,
            position: gLatLng,
            label: (marker.id || marker.count).toString(),
            map: this.map,
          })
        )

        gBounds.extend(gLatLng)
      }

      // this.map.fitBounds(gBounds, 10)
    },
  },
}
</script>

<style lang="scss" scoped></style>
