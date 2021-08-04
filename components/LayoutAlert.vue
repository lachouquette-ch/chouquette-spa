<template>
  <div class="layout-alert fixed-top">
    <b-alert
      v-for="alert in alerts"
      :key="alert.message"
      :show="5"
      dismissible
      :variant="alert.type"
      @dismissed="removeAlert(alert)"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="alert.message" />
    </b-alert>
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
  //z-index: $zindex-popover;
}

.alert {
  margin: 5px 10px;
  border-radius: 5px;

  a {
    color: $black;
  }
}
</style>
