<template>
  <div class="layout-alert fixed-top">
    <div v-for="alert in alerts" :key="alert.message" :type="alert.type">
      <LayoutAlertSingle v-for="alert in alerts" :key="alert.message" :type="alert.type" @close="removeAlert(alert)">
        <span v-html="alert.message" />
      </LayoutAlertSingle>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LayoutAlertSingle from './LayoutAlertSingle'

export default {
  components: { LayoutAlertSingle },
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
.layout-alert {
  z-index: $zindex-popover;
}
</style>
