<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-card class="d-flex flex-row" height="75" width="250" flat tile ripple @click="btnAction">
    <Media
      v-if="fiche.image"
      :media="fiche.image"
      size="thumbnail"
      width="75"
      contain
      aspect-ratio="1"
      class="flex-grow-0"
    ></Media>
    <v-card-text class="pa-2 flex-grow-1 overflow-hidden">
      <p class="ma-0 text-body-1 text-truncate">{{ fiche.title }}</p>
      <p class="ma-0 text-body-2 font-italic">{{ categoryName }}</p>
      <span class="text-caption text-decoration-underline">Voir +</span>
    </v-card-text>
  </v-card>
</template>

<script>
import Media from '~/components/Media'

export default {
  components: { Media },
  props: {
    fiche: {
      type: Object,
      required: true,
    },
    btnAction: {
      type: Function,
      default: () => {
        // eslint-disable-next-line no-console
        console.log('Show btn action')
      },
    },
  },
  computed: {
    googleMapsURL() {
      return `https://maps.google.com/?q=${this.fiche.poi.address}`
    },
    categoryName() {
      // hack since no $nuxt context attached (component created manually)
      return this.$nuxt.$store.state.categories.all[this.fiche.principalCategoryId].name
    },
  },
}
</script>

<style lang="scss" scoped>
.fiche-infowindow {
  width: 250px;
  max-width: 100%;

  h2 {
    font-family: $heading-font-family;
  }
}

.fiche-infowindow-img {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
}
</style>
