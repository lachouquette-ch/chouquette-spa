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
