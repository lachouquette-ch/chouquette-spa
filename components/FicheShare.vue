<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <template v-if="shareApiAvailable">
      <v-btn
        v-bind="{ ...$props, ...$attrs }"
        @click.prevent="shareWith('Adresse sur LaChouquette.ch', fiche.title, ficheURL)"
      >
        <v-icon :left="!!$slots.default">mdi-share-variant</v-icon>
        <slot></slot>
      </v-btn>
    </template>
    <template v-else>
      <v-menu top>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="{ ...attrs, ...$props, ...$attrs }" v-on="on">
            <v-icon :left="!!$slots.default">mdi-share-variant</v-icon>
            <slot></slot>
          </v-btn>
        </template>

        <v-list>
          <v-list-item target="_blank" :href="`https://www.facebook.com/sharer/sharer.php?u=${ficheURL}`">
            <v-list-item-title><v-icon color="#4267b2" class="mr-2">mdi-facebook</v-icon>Facebook</v-list-item-title>
          </v-list-item>
          <v-list-item
            target="_blank"
            :href="`https://twitter.com/share?text=${fiche.title}&url=${encodeURI(ficheURL)}`"
          >
            <v-list-item-title><v-icon color="#38a1f3" class="mr-2">mdi-twitter</v-icon>Twitter</v-list-item-title>
          </v-list-item>
          <v-list-item
            target="_blank"
            :href="`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURI(ficheURL)}&title=${fiche.title}`"
          >
            <v-list-item-title><v-icon color="#0A66C2" class="mr-2">mdi-linkedin</v-icon>LinkedIn</v-list-item-title>
          </v-list-item>
          <v-list-item
            target="_blank"
            :href="`mailto:?subject=${fiche.title}&amp;body=Je te partage cette adresse ${ficheURL}`"
          >
            <v-list-item-title><v-icon color="#b7b7b7" class="mr-2">mdi-at</v-icon> Email</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </div>
</template>

<script>
import share from '~/mixins/share'

export default {
  mixins: [share],
  props: {
    fiche: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ficheURL() {
      return `${this.$config.siteUrl}/fiche/${this.fiche.slug}`
    },
  },
}
</script>

<style scoped></style>
