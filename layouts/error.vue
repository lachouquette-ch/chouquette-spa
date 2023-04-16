<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-sheet class="error lighten-2 pa-3">
    <component :is="errorComponent" :message="message" />
  </v-sheet>
</template>

<script>
import Error from '~/components/Error'
import Error404 from '~/components/Error404'
import Error410 from '~/components/Error410'

export default {
  components: { Error, Error404, Error410 },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      from: null,
    }
  },
  computed: {
    errorComponent() {
      const name = 'Error' + this.error.statusCode
      return this.$options.components[name] ? name : 'Error'
    },
    message() {
      return this.error.message
    },
  },
  created() {
    // eslint-disable-next-line no-console
    console.error(this.message, this.error)
  },
}
</script>

<style lang="scss" scoped>
.error {
  h1 {
    font-family: $secondary-font-family;
  }
}
</style>
