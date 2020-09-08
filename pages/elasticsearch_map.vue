<template>
  <div class="container layout-content my-3">
    <div ref="map" style="height: 50vh;" />
  </div>
</template>

<script>
import _ from 'lodash'
import MarkerClusterer from '@google/markerclustererplus'
import { CLUSTER_STYLES, MAP_OPTIONS } from '~/constants/mapSettings'

export default {
  data() {
    return {
      map: null,
      markerClusterer: null,
      google: null,
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

    const fetchMarkersDebounce = _.debounce(async () => await this.fetchMarkers(), 500)
    this.google.maps.event.addDomListenerOnce(this.map, 'idle', async () => {
      await this.fetchMarkers()
      this.markerClusterer.fitMapToMarkers() // initialize fit
      // wait a little to avoid double fetching markers
      setTimeout(() => this.google.maps.event.addListener(this.map, 'idle', fetchMarkersDebounce), 1000)
    })
  },
  methods: {
    async fetchMarkers() {
      // remove current markers
      this.markerClusterer.clearMarkers()

      const mapBounds = this.map.getBounds().toJSON()
      const mapZoom = this.map.getZoom()
      const markers = await this.$esAPI.searchMarkers(mapBounds, mapZoom)
      // eslint-disable-next-line no-console
      console.debug('markers count', markers.length)

      // build markers
      const gMarkers = []
      for (const marker of markers) {
        const gLatLng = new this.google.maps.LatLng(marker.coord.latitude, marker.coord.longitude)

        // eslint-disable-next-line no-new
        gMarkers.push(
          new this.google.maps.Marker({
            // icon: fiche.main_category.marker_icon,
            position: gLatLng,
            label: (marker.id || marker.count).toString(),
            count: marker.count,
            chouquettise: marker.chouquettise,
          })
        )
      }

      this.markerClusterer.addMarkers(gMarkers)
    },
  },
}
</script>

<style lang="scss" scoped></style>
