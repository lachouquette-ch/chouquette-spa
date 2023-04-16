<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-card
    hover
    ripple
    width="200"
    max-width="60vw"
    v-bind="{ ...$props, ...$attrs }"
    :to="ficheLink"
    :nuxt="!disableLink"
    @click.prevent="$emit('click')"
  >
    <Media v-if="fiche.image" :media="fiche.image" size="medium_large" height="200">
      <v-card-subtitle v-if="fiche.isChouquettise" class="pa-2">
        <v-chip color="cq-yellow" text-color="black" small>
          Testé et Chouquettisé
          <v-icon right>mdi-check</v-icon>
        </v-chip>
      </v-card-subtitle>
    </Media>
    <v-img v-else height="200" style="background-color: var(--v-cq-beige-base)"></v-img>
    <v-card-title class="d-block">
      <h3>{{ fiche.title }}</h3>
      <v-card-subtitle class="pa-0 mt-1 secondary--text">
        <span v-if="fiche.locationId">{{ getLocationById(fiche.locationId).name }} - </span>
        {{ getCategoryById(fiche.principalCategoryId).name }}
      </v-card-subtitle>
    </v-card-title>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Media from '~/components/Media'

export default {
  components: { Media },
  props: {
    fiche: {
      required: true,
      type: Object,
    },
    disableLink: Boolean,
  },
  computed: {
    ...mapGetters('categories', {
      getCategoryById: 'getById',
    }),
    ...mapGetters('locations', {
      getLocationById: 'getById',
    }),
    ficheLink() {
      return this.disableLink ? null : `/fiche/${this.fiche.slug}`
    },
  },
}
</script>

<style lang="scss" scoped></style>
