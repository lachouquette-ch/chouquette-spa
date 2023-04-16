<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <div v-if="$vuetify.breakpoint.mobile" :id="id" class="scroll-x-container">
      <div v-for="item in items" :key="item[itemId]">
        <slot :item="item"></slot>
      </div>
      <slot name="after"></slot>
    </div>
    <div v-else-if="!mobileOnly" :id="id">
      <div v-if="desktopFlex" class="d-flex flex-wrap justify-center">
        <div v-for="item in items" :key="item[itemId]" :cols="cols" :md="md" class="ma-2">
          <slot :item="item"></slot>
        </div>
      </div>
      <v-container v-else>
        <v-row align="top" justify="center">
          <v-col v-for="item in items" :key="item[itemId]" :cols="cols" :md="md">
            <slot :item="item"></slot>
          </v-col>
          <v-col v-if="$slots.after" :cols="cols" :md="md">
            <slot name="after"></slot>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    id: String,
    itemId: { type: String, default: 'id' },
    mobileOnly: Boolean,
    desktopFlex: Boolean,
    cols: { type: [String, Number], default: 12 },
    md: { type: [String, Number], default: 6 },
  },
  data() {
    return {
      item: null,
    }
  },
}
</script>

<style lang="scss" scoped>
.scroll-x-container {
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 30px;
  display: flex;
  padding-bottom: 0.75rem;

  > * {
    scroll-snap-align: start;

    &:not(:last-child) {
      margin-right: 0.75rem;
    }
  }
}
</style>
