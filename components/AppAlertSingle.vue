<template>
  <div class="alert alert-dismissible fade show" :class="typeClass" role="alert">
    <slot />
    <button type="button" class="close" aria-label="Fermer" @click="close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info',
      validator(value) {
        // The value must match one (subset) of alert types https://getbootstrap.com/docs/4.3/components/alerts/
        return ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(value)
      }
    },
    timeout: {
      type: Number,
      default: 3000
    }
  },
  computed: {
    typeClass() {
      return `alert-${this.type}`
    }
  },
  mounted() {
    const Alert = require('bootstrap/js/dist/alert')
    this.alert = new Alert(this.$el)
    setTimeout(() => this.close(), this.timeout)
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      this.alert.close()
      this.alert.dispose()
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  margin: 5px 10px;
  border-radius: 5px;

  a {
    color: $black;
  }
}
</style>
