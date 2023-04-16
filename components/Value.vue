<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-card color="white" class="text-center mx-auto py-5 d-flex flex-column" width="300" height="500">
    <v-card-title class="justify-center text-uppercase">
      <h3 class="valeur-title">{{ value.name }}</h3>
    </v-card-title>
    <div class="px-5">
      <Media :media="value.image" size="medium" contain class="mx-auto" flat></Media>
    </div>
    <v-card-text class="text-body-1">{{ value.description }}</v-card-text>
    <v-spacer></v-spacer>
    <v-card-actions class="justify-center align-self-">
      <v-btn text nuxt :to="`/${labelPage}#valeur-${value.slug}`" class="text-decoration-underline">en savoir +</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import Media from '~/components/Media'

export default {
  components: { Media },
  props: {
    value: Object,
  },
  computed: mapState({
    // arrow functions can make the code very succinct!
    labelPage: (state) => state.labelPage,
  }),
}
</script>

<style lang="scss" scoped>
h3 {
  font-family: $secondary-font-family !important;
  letter-spacing: 1.5px !important;
  border: 1px solid black;
  padding: 5px 10px;
}
</style>
