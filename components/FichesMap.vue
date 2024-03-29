<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div class="map" style="position: relative">
    <v-overlay :value="ficheLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div ref="map" style="height: 100%; width: 100%" />
    <span
      v-if="!preview && hasMoreFiches"
      :style="`position: absolute; bottom: ${moreButtonOffset}px; left: 50%; transform: translateX(-50%)`"
    >
      <v-btn
        :loading="fetchLoading"
        :small="$vuetify.breakpoint.mobile"
        rounded
        color="cq-blue"
        class="btn--hover-white"
        @click="$emit('moreFiches')"
      >
        + de fiches
        <v-icon right>mdi-cloud-upload</v-icon>
      </v-btn>
    </span>
  </div>
</template>

<script>
import Vue from 'vue'
import MarkerClusterer from '@googlemaps/markerclustererplus'

import { CLUSTER_STYLES, MAP_OPTIONS, Z_INDEXES, ZOOM_LEVELS } from '~/constants/mapSettings'
import FicheInfoWindow from '~/components/FicheInfoWindow'

// create classes from components to use it in code
const FicheInfoWindowClass = Vue.extend(FicheInfoWindow)

export default {
  props: {
    fiches: {
      type: Array,
      required: true,
    },
    hasMoreFiches: Boolean,
    ficheLoading: Boolean,
    fetchLoading: Boolean,
    preview: Boolean,
    footerOffet: Number,
  },
  data() {
    return {
      google: null,
      map: null,
      markers: new Map(),
      currentMarker: null,
      infoWindows: new Map(),
      currentInfoWindow: null,
      markerClusterer: null,
      isMapShown: null,
    }
  },
  computed: {
    moreButtonOffset() {
      return this.footerOffet + 15
    },
  },
  watch: {
    fiches() {
      this.loadFichesOnMap()
    },
  },
  async mounted() {
    // build map
    this.google = await this.$googleMaps
    this.map = new this.google.maps.Map(this.$refs.map, {
      ...MAP_OPTIONS,
      zoomControlOptions: {
        position: this.google.maps.ControlPosition.TOP_RIGHT,
      },
    })

    // create cluster
    this.markerClusterer = new MarkerClusterer(this.map, [], {
      averageCenter: true,
      styles: CLUSTER_STYLES,
      calculator: (markers, clusterIconStylesCount) => {
        const index = markers.find((marker) => marker.chouquettise) ? 2 : 1
        return {
          index,
          text: markers.length,
        }
      },
    })

    // map specificities
    if (this.preview) {
      this.map.gestureHandling = 'none'
      this.map.setOptions({
        fullscreenControl: true,
        fullscreenControlOptions: { position: this.google.maps.ControlPosition.TOP_LEFT },
      })
    } else {
      // create map controls
      const centerControlButton = document.createElement('button')
      centerControlButton.className = 'google-map-control'
      centerControlButton.title = 'Voir toutes les fiches sur la carte'
      const centerControlButtonContent = document.createElement('i')
      // centerControlButtonContent.className = 'material-icons'
      centerControlButtonContent.className = 'mdi mdi-arrow-expand-all gm-control-active'
      centerControlButtonContent.style = 'color: #666666; font-size: 30px; font-weight: bold;'
      centerControlButton.appendChild(centerControlButtonContent)
      centerControlButton.addEventListener('click', () => this.resetMap())
      this.map.controls[this.google.maps.ControlPosition.TOP_LEFT].push(centerControlButton)
    }

    // fullscreen handler
    let fullScreen = false
    document.onfullscreenchange = () => {
      if (fullScreen) {
        this.$emit('fullScreenOff')
        fullScreen = false
        if (this.preview) {
          this.map.gestureHandling = 'none'
          this.resetMap()
        }
      } else {
        this.$emit('fullScreenOn')
        fullScreen = true
        if (this.preview) {
          this.map.gestureHandling = 'greedy'
        }
      }
    }

    this.loadFichesOnMap()
  },
  methods: {
    clear() {
      // map
      this.markers.clear()
      this.currentMarker = null
      this.infoWindows.clear()
      this.currentInfoWindow = null
      this.markerClusterer.clearMarkers()
    },
    gotoMarker(fiche) {
      this.resetMapObjects()
      this.isMapShown = true

      this.currentMarker = this.markers.get(fiche.id)
      this.map.setZoom(ZOOM_LEVELS.activated)
      this.map.setCenter(this.currentMarker.getPosition())
      this.currentInfoWindow = this.infoWindows.get(fiche.id)
      this.currentInfoWindow.open(this.map, this.currentMarker)
    },
    resetMapObjects() {
      if (this.currentMarker) {
        this.currentMarker.setZIndex(this.currentMarker.defaultZIndex)
      }
      if (this.currentInfoWindow) {
        this.currentInfoWindow.close()
      }
    },
    resetMap() {
      this.resetMapObjects()

      this.currentMarker = this.markers.values().next().value
      this.currentInfoWindow = this.infoWindows.values().next().value

      if (this.markers.size === 1 && this.preview) {
        this.map.setCenter(this.currentMarker.getPosition())
      } else {
        this.markerClusterer.fitMapToMarkers({ top: 5, right: 5, bottom: 64, left: 5 })
      }
    },
    loadFichesOnMap() {
      this.clear()

      for (const fiche of this.fiches) {
        if (!fiche.poi) {
          continue
        }

        // build infoWindow content
        const ficheInfoWindow = new FicheInfoWindowClass({
          propsData: {
            fiche,
            btnAction: () => {
              this.$emit('mapSelectFiche', fiche)
            },
          },
        })
        ficheInfoWindow.$mount()

        // create infoWindow
        const infoWindow = new this.google.maps.InfoWindow({
          content: ficheInfoWindow.$el,
        })
        this.infoWindows.set(fiche.id, infoWindow)

        // create marker
        const marker = new this.google.maps.Marker({
          icon: fiche.poi.marker,
          position: fiche.poi,
          title: fiche.title,
        })
        marker.defaultZIndex = fiche.isChouquettise ? Z_INDEXES.chouquettise : Z_INDEXES.default
        marker.chouquettise = fiche.isChouquettise
        marker.setZIndex(marker.defaultZIndex)
        if (!this.preview) {
          marker.addListener('click', () => {
            this.resetMapObjects()

            marker.setZIndex(Z_INDEXES.selected)
            infoWindow.open(this.map, marker)

            this.currentMarker = marker
            this.currentInfoWindow = infoWindow
          })
        }
        this.markers.set(fiche.id, marker)
      }

      this.markerClusterer.addMarkers(Array.from(this.markers.values()))

      // reset map
      this.resetMap()
    },
  },
}
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
  width: 100%;
}

// hack google map style

::v-deep .gm-style-iw.gm-style-iw-c {
  padding: 0 !important;
}

::v-deep .gm-style-iw-d {
  overflow: hidden !important;
}
</style>
