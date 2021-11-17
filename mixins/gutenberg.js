import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['wordpressUrl']),
  },
  mounted() {
    // execute anchor fixing
    // const linkAnchorFixedHeader = require('~/assets/scripts/link-anchor-fixed-header')
    // linkAnchorFixedHeader()

    // RUN WORDPRESS JAVASCRIPT

    // body - script 1
    document.body.classList.remove('no-js')
    // body - script 2
    if (navigator.userAgent.includes('MSIE') || navigator.appVersion.includes('Trident/')) {
      document.body.classList.add('is-IE')
    }
    // body - script 3 (updated)
    global.advgb = { imageCaption: '1' }

    // LOAD SCRIPTS
    // const loadScript = require('~/assets/scripts/load-script')

    const $script = require('scriptjs')

    $script(
      [
        /* DO NOT LOAD JQUERY SINCE ALREADY LOADED BY PROJECT */
        // 'https://wordpress.lachouquette.ch/wp-includes/js/jquery/jquery.min.js?ver=3.5.1',
        // 'https://wordpress.lachouquette.ch/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2',

        'https://wordpress.lachouquette.ch/wp-includes/js/jquery/ui/core.min.js?ver=1.12.1',
        'https://wordpress.lachouquette.ch/wp-includes/js/jquery/ui/tabs.min.js?ver=1.12.1',
      ],
      'jquery-ui'
    )

    $script(
      [
        'https://wordpress.lachouquette.ch/wp-includes/js/wp-emoji-release.min.js?ver=5.7.2',
        'https://wordpress.lachouquette.ch/wp-includes/js/wp-embed.min.js?ver=5.7.2',

        'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/js/jquery.colorbox.min.js?ver=2.8.0',
        'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/js/gallery.colorbox.init.js?ver=2.8.0',
        'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/blocks/summary/summaryMinimized.js?ver=5.7.2',
        'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/blocks/advtabs/frontend.js?ver=2.8.0',
        'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/js/slick.min.js?ver=2.8.0',

        '//www.instagram.com/embed.js',
      ],
      'wordpress'
    )

    $script.ready(['jquery-ui', 'wordpress'], function () {
      // execute advance-gutenberg inner script
      const jQuery = require('jquery')
      // body footer - script 1
      jQuery(document).ready(function ($) {
        $('.advgb-images-slider-block .advgb-images-slider:not(.slick-initialized)').slick({
          dots: true,
          adaptiveHeight: true,
        })
      })
    })
  },
  methods: {
    gutenbergStylesheets() {
      function addStylesheet(href) {
        return {
          rel: 'stylesheet',
          href,
        }
      }

      return [
        addStylesheet('https://wordpress.lachouquette.ch/wp-includes/css/dist/block-library/style.min.css?ver=5.7.2'),
        addStylesheet('https://wordpress.lachouquette.ch/wp-includes/css/dist/block-library/theme.min.css?ver=5.7.2'),
        addStylesheet('https://wordpress.lachouquette.ch/wp-includes/css/dashicons.min.css?ver=5.7.2'),
        addStylesheet(
          'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/css/blocks.css?ver=2.8.0'
        ),
        addStylesheet(
          'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/css/fonts/material-icons.min.css?ver=5.7.2'
        ),
        addStylesheet(
          'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/css/colorbox.css?ver=2.8.0'
        ),
        addStylesheet(
          'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/css/slick.css?ver=5.7.2'
        ),
        addStylesheet(
          'https://wordpress.lachouquette.ch/wp-content/plugins/advanced-gutenberg/assets/css/slick-theme.css?ver=5.7.2'
        ),
      ]
    },
  },
}
