<template>
  <div class="app-alert fixed-top">
    <div v-for="alert in alerts" :key="alert.message" :type="alert.type">
      <AppAlertSingle v-for="alert in alerts" :key="alert.message" :type="alert.type" @close="removeAlert(alert)">
        <span v-html="alert.message" />
      </AppAlertSingle>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppAlertSingle from './AppAlertSingle'

export default {
  components: { AppAlertSingle },
  computed: {
    ...mapState('alerts', {
      alerts: 'all'
    })
  },
  methods: {
    removeAlert(alert) {
      this.$store.dispatch('alerts/removeAction', alert)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-alert {
  z-index: $zindex-popover;
}
</style>
