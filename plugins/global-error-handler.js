import Vue from 'vue'

Vue.config.errorHandler = (err, vm, info) => {
  // eslint-disable-next-line no-undef
  $nuxt.$sentry.captureException(err)
}
