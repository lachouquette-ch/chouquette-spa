<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-list-item-group v-model="selectedItem" color="primary">
    <v-list-item to="/adresses" nuxt>
      <v-list-item-icon><v-icon>mdi-map-marker-multiple-outline</v-icon></v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Des adresses ?</v-list-item-title>
        <v-list-item-subtitle class="text-decoration-underline">C'est pas ici</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item to="/articles" nuxt>
      <v-list-item-icon><v-icon>mdi-newspaper-variant-multiple</v-icon></v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Des articles ?</v-list-item-title>
        <v-list-item-subtitle class="text-decoration-underline">C'est pas là</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item to="/" nuxt>
      <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Aucune idée ?</v-list-item-title>
        <v-list-item-subtitle class="text-decoration-underline">Alors laisse toi guider...</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</template>

<script>
export default {
  data() {
    return {
      selectedItem: null,
    }
  },
}
</script>

<style scoped></style>
