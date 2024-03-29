/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import webpack from 'webpack'

import axios from 'axios'

export default {
  publicRuntimeConfig: {
    mailChimpUserId: process.env.MAILCHIMP_USER_ID,
    mailChimpListId: process.env.MAILCHIMP_LIST_ID,
    googleMapsKey: process.env.GOOGLE_MAPS_KEY,
    siteUrl: process.env.SITE_URL || 'https://lachouquette.ch',
    recaptcha: {
      /* reCAPTCHA options */
      siteKey: process.env.RECAPTCHA_SITE_KEY,
      hideBadge: true,
      version: 3,
    },
  },
  ssr: false,
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'fr',
    },
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      { name: 'theme-color', content: '#EFE407' },
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
      { name: 'msapplication-TileColor', content: '#EFE407' },
      { name: 'msapplication-TileImage', content: '/favicons/ms-icon-144x144.png' },

      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Oswald:wght@300;400;700&display=swap',
      },
    ],
  },
  router: {
    middleware: 'redirect',
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { height: '5px', color: '#EFE407' },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/global-error-handler.js', mode: 'client' },
    { src: '~/plugins/jquery.js', mode: 'client' },
    { src: '~/plugins/google-maps.js', mode: 'client' },
    { src: '~/plugins/vuelidate.js' },
    { src: '~/plugins/html-entity-filter.js' },
    { src: '~/plugins/pretty-url-filter.js' },
    { src: '~/plugins/iso-date-filter.js' },
    { src: '~/plugins/vue2-hammer.js', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    ['@nuxtjs/google-analytics', { id: 'UA-47894326-1' }],
    ['@nuxtjs/vuetify'],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    '@nuxtjs/style-resources',
    '@nuxtjs/sentry',
    '@nuxtjs/sitemap',
    '@nuxtjs/recaptcha',
  ],
  vuetify: {
    optionsPath: '~/vuetify.options.js',
    customVariables: ['~/assets/scss/vuetify.scss'],
    treeShake: true,
  },
  apollo: {
    tokenName: 'chouquette', // specify token name
    cookieAttributes: {
      expires: 7, // optional, default: 7 (days)
    },
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
    watchLoading: '~/apollo/loadingHandler.js',
    errorHandler: '~/apollo/errorHandler.js',
    clientConfigs: {
      default: {
        httpEndpoint: process.env.GRAPHQL_URI || 'http://localhost:4000/graphql',
        browserHttpEndpoint: process.env.BROWSER_GRAPHQL_URI || 'http://localhost:4000/graphql',
      },
    },
  },
  sentry: {
    dsn: 'https://aaf0c41235c44040ae01dcd356fb3e6f@o397059.ingest.sentry.io/5251223',
    disabled: process.env.DISABLE_SENTY ? JSON.parse(process.env.DISABLE_SENTY) : false,
    // publishRelease: true, // TODO needs additional env https://sentry.nuxtjs.org/sentry/options/#publishrelease
    // attachCommits: true,
  },
  sitemap: {
    hostname: 'https://lachouquette.ch',
    path: '/sitemap.xml',
    gzip: true,
    sitemaps: [
      {
        path: '/sitemap-static.xml',
        routes: [],
      },
      {
        path: '/sitemap-posts.xml',
        exclude: ['/**'],
        routes: async () => {
          let page = 1
          let hasMorePage = false
          const posts = []
          do {
            const { data, headers } = await axios.get(
              `https://wordpress.lachouquette.ch/wp-json/wp/v2/posts/?_fields=slug&per_page=100&page=${page}`
            )
            posts.push(...data.map(({ slug }) => `/${slug}`))
            hasMorePage = headers['x-wp-totalpages'] > page++
          } while (hasMorePage)

          return posts
        },
      },
      {
        path: '/sitemap-fiches.xml',
        exclude: ['/**'],
        routes: async () => {
          let page = 1
          let hasMorePage = false
          const posts = []
          do {
            const { data, headers } = await axios.get(
              `https://wordpress.lachouquette.ch/wp-json/wp/v2/fiches/?_fields=slug&per_page=100&page=${page}`
            )
            posts.push(...data.map(({ slug }) => `/fiche/${slug}`))
            hasMorePage = headers['x-wp-totalpages'] > page++
          } while (hasMorePage)

          return posts
        },
      },
    ],
  },
  styleResources: {
    scss: ['~/assets/scss/_mixins.scss', '~/assets/scss/_variables.scss'],
  },
  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {
      config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map'
    },
    transpile: [
      ({ isClient }) => isClient && 'query-string',
      ({ isClient }) => isClient && 'split-on-first',
      ({ isClient }) => isClient && 'strict-uri-encode',
      'vue-cookieconsent-component',
    ],
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'jquery-ui': 'jquery-ui/jquery-ui.js',
      }),
    ],
  },
}
