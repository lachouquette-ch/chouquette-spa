<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-fade-transition>
    <v-btn v-if="show" class="btn-top primary white--text" fab small @click="scrollTop">
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-fade-transition>
</template>

<script>
import goTo from 'vuetify/lib/services/goto'

export default {
  data() {
    return {
      show: false,
    }
  },
  mounted() {
    const $ = require('jquery')
    $(window).on('scroll', () => {
      const height = $(window).scrollTop()
      if (height >= $(window).height() / 2) {
        this.show = true
      } else {
        this.show = false
      }
    })
  },
  beforeDestroy() {
    const $ = require('jquery')
    $(window).off('scroll')
  },
  methods: {
    scrollTop() {
      goTo(0)
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-top {
  position: fixed;
  margin-bottom: 10px;
  opacity: 0.7;

  @include hover-focus-active() {
    opacity: 1;
  }

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    bottom: 56px;
    right: 10px;
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    bottom: 0;
    right: calc(50% - #{map-get($grid-breakpoints, 'md') / 2});
  }
}
</style>
