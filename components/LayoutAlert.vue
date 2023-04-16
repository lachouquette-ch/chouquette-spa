<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div v-if="alerts.length" class="layout-alert">
    <v-fade-transition group>
      <v-alert
        v-for="alert in alerts"
        :key="alert.message"
        :show="5"
        dismissible
        dense
        :icon="false"
        :type="alert.type"
        toggle="removeAlert(alert)"
        class="mb-1"
      >
        <template #close="">
          <v-btn icon @click="removeAlert(alert)"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
        </template>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="alert.message" />
      </v-alert>
    </v-fade-transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('alerts', {
      alerts: 'all',
    }),
  },
  methods: {
    removeAlert(alert) {
      this.$store.dispatch('alerts/removeAction', alert)
    },
  },
}
</script>

<style lang="scss" scoped>
.layout-alert {
  position: fixed;
  width: 100vw;
  padding: 10px;
  z-index: 10;
}
</style>
