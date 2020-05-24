import webpack from 'webpack'

require('dotenv').config()

export default {
  env: {
    baseUrl: process.env.URL || 'https://lachouquette.ch',
    wpBaseUrl: process.env.WP_URL,
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
    mailChimpUserId: process.env.MAILCHIMP_USER_ID,
    mailChimpListId: process.env.MAILCHIMP_LIST_ID,
    googleMapsKey: process.env.GOOGLE_MAPS_KEY
  },
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'fr'
    },
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
      // favicons
      { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '57x57', href: '/favicons/apple-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/favicons/apple-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', href: '/favicons/apple-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/favicons/apple-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', href: '/favicons/apple-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: '120x120', href: '/favicons/apple-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: '144x144', href: '/favicons/apple-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/favicons/apple-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-icon-180x180.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicons/android-icon-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicons/favicon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' },
      { name: 'msapplication-TileColor', content: '#f2e808' },
      { name: 'msapplication-TileImage', content: '/favicons/ms-icon-144x144.png' },
      { name: 'theme-color', content: '#f2e808' },

      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Lobster+Two|Shadows+Into+Light+Two|Lato&display=swap'
      }
    ]
  },
  router: {
    middleware: 'redirect'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { height: '5px', color: '#f2e808' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/vue-recaptcha-v3.js', mode: 'client' },
    { src: '~/plugins/bootstrap.js', mode: 'client' },
    { src: '~/plugins/jquery.js', mode: 'client' },
    { src: '~/plugins/google-maps.js', mode: 'client' },
    { src: '~/node_modules/vue-awesome-swiper', mode: 'client' },
    { src: '~/plugins/vuelidate.js' },
    { src: '~/plugins/html-entity-filter.js' },
    { src: '~/plugins/pretty-url-filter.js' },
    { src: '~/plugins/wordpress-API.js' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    ['@nuxtjs/google-analytics', { id: 'UA-47894326-1' }]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/style-resources', 'bootstrap-vue/nuxt', 'vue-scrollto/nuxt', '@nuxtjs/sentry'],
  sentry: {
    dsn: 'https://aaf0c41235c44040ae01dcd356fb3e6f@o397059.ingest.sentry.io/5251223', // Enter your project's DSN here
  },
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
    componentPlugins: [
      'AlertPlugin',
      'ModalPlugin',
      'OverlayPlugin',
      'DropdownPlugin',
      'CollapsePlugin',
      'SpinnerPlugin'
    ],
    directivePlugins: ['VBVisiblePlugin']
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [
      ({ isClient }) => isClient && 'query-string',
      ({ isClient }) => isClient && 'split-on-first',
      ({ isClient }) => isClient && 'strict-uri-encode',
      'vue-cookieconsent-component'
    ],
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'jquery-ui': 'jquery-ui/jquery-ui.js'
      })
    ]
  }
}
