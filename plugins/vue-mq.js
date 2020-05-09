import Vue from 'vue'
import VueMq from 'vue-mq'

Vue.use(VueMq, {
  breakpoints: {
    // default breakpoints - using Bootstrap 4
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },
  defaultBreakpoint: 'sm' // customize this for SSR
})
