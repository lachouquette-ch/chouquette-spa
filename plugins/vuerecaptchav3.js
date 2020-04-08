import Vue from 'vue'
import { VueReCaptcha } from 'vue-recaptcha-v3'

Vue.use(VueReCaptcha, {
  siteKey: process.env.recaptchaSiteKey,
  loaderOptions: {
    autoHideBadge: true
  }
})