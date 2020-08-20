import Vue from 'vue'
import { VueReCaptcha } from 'vue-recaptcha-v3'

// Dev tip : if component fails in a strange way with 'null' : it's probably the recaptcha configuration (on google admin) that doesn't allow this domain
Vue.use(VueReCaptcha, {
  siteKey: process.env.recaptchaSiteKey,
  loaderOptions: {
    autoHideBadge: true,
  },
})
