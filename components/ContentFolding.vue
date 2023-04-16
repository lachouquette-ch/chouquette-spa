<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <div :class="{ folded: folded }">
      <slot></slot>
    </div>
    <div v-if="folded" class="text-center">
      <v-btn color="cq-blue" class="text-center" @click="folded = false">{{ btnContent }}</v-btn>
    </div>
  </div>
</template>

<script>
import isbot from 'isbot'

export default {
  props: {
    btnContent: {
      type: String,
      default: 'Lire la suite',
    },
  },
  data() {
    return {
      folded: true,
    }
  },
  mounted() {
    this.folded = !isbot(navigator.userAgent)
  },
}
</script>

<style lang="scss" scoped>
.folded {
  position: relative;
  height: 300px;
  overflow: hidden;

  &:after {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    content: '';
    background: linear-gradient(180deg, transparent 60%, white);
    pointer-events: none;
  }
}
</style>
