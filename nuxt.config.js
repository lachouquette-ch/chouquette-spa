require('dotenv').config()
const path = require('path')

export default {
  env: {
    wpBaseUrl: process.env.WP_URL,
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
    mailChimpUserId: process.env.MAILCHIMP_USER_ID,
    mailChimpListId: process.env.MAILCHIMP_LIST_ID
  },
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/vuelidate.js', mode: 'client' },
    { src: '~/plugins/vuerecaptchav3.js', mode: 'client' },
    { src: '~/plugins/bootstrap.js', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // FIXME '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/style-resources-module/blob/master/README.md
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: [
      './assets/css/_variables.scss',
      './node_modules/bootstrap/scss/_functions.scss',
      './node_modules/bootstrap/scss/_variables.scss',
      './node_modules/bootstrap/scss/_mixins.scss'
    ]
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [
      ({ isClient }) => isClient && 'query-string',
      ({ isClient }) => isClient && 'split-on-first',
      ({ isClient }) => isClient && 'strict-uri-encode'
    ]
  }
}
