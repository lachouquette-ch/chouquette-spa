require('dotenv').config()

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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Lobster+Two|Shadows+Into+Light+Two|Lato&display=swap'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#f2e808' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/vuelidate.js', mode: 'client' },
    { src: '~/plugins/vuerecaptchav3.js', mode: 'client' },
    { src: '~/plugins/bootstrap.js', mode: 'client' },
    { src: '~/plugins/wordpressAPI.js' }
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
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'bootstrap-vue/nuxt'
  ],
  styleResources: {
    scss: [
      '~/assets/css/_variables.scss',
      '~/assets/css/_mixins.scss',
      '~/node_modules/bootstrap/scss/_functions.scss',
      '~/node_modules/bootstrap/scss/_variables.scss',
      '~/node_modules/bootstrap/scss/_mixins.scss'
    ]
  },
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    components: ['BAlert'],
    directives: []
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
