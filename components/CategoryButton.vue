<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <button
    v-ripple
    class="top-category-btn rounded-xl"
    :class="{ primary: selected }"
    :disabled="disabled"
    @click.prevent="$emit('click', topCategory)"
  >
    <v-list-item two-line>
      <v-list-item-avatar class="rounded-0">
        <Media v-if="selected" :media="topCategory.logoWhite" size="thumbnail"></Media>
        <Media v-else :media="topCategory.logoBlack" size="thumbnail"></Media>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title :class="[selected ? 'white--text' : 'black--text']">{{
          topCategory.name
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </button>
</template>

<script>
import Media from '~/components/Media'

export default {
  components: { Media },
  props: {
    topCategory: Object,
    selected: Boolean,
    disabled: Boolean,
  },
}
</script>

<style lang="scss" scoped>
.top-category-btn {
  width: 190px;
  background-color: white;
  box-shadow: map-get($shadow-key-umbra, 4) !important;

  @include hover-focus-active {
    background-color: var(--v-primary-lighten5);
  }

  &:disabled,
  &button[disabled] {
    opacity: 0.6;
  }
}
</style>
