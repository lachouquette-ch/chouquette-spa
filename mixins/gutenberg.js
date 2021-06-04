import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['wordpressUrl']),
  },
  mounted() {
    const loadScript = require('simple-load-script').all
    loadScript(
      this.wordpressUrl + '/wp-includes/js/twemoji.js?ver=5.3.2',
      this.wordpressUrl + '/wp-includes/js/wp-emoji.js?ver=5.3.2',
      this.wordpressUrl + '/wp-includes/js/hoverintent-js.min.js?ver=2.2.1',
      this.wordpressUrl + '/wp-includes/js/wp-embed.js?ver=5.3.2',
      this.wordpressUrl + '/wp-content/plugins/advanced-gutenberg/assets/blocks/summary/summaryMinimized.js?ver=5.3.2',
      this.wordpressUrl + '/wp-content/plugins/advanced-gutenberg/assets/js/jquery.colorbox.min.js?ver=2.3.5',
      this.wordpressUrl + '/wp-content/plugins/advanced-gutenberg/assets/blocks/advvideo/lightbox.js?ver=2.3.5',
      this.wordpressUrl + '/wp-content/plugins/advanced-gutenberg/assets/js/jquery.colorbox.min.js?ver=2.3.5',
      this.wordpressUrl + '/wp-includes/js/jquery/ui/core.min.js?ver=1.11.4',
      this.wordpressUrl + '/wp-includes/js/jquery/ui/widget.min.js?ver=1.11.4',
      this.wordpressUrl + '/wp-includes/js/jquery/ui/accordion.min.js?ver=1.11.4',
      this.wordpressUrl + '/wp-includes/js/jquery/ui/tabs.min.js?ver=1.11.4',
      this.wordpressUrl + '/wp-content/plugins/advanced-gutenberg/assets/blocks/advtabs/frontend.js?ver=2.3.5',
      this.wordpressUrl + '/wp-content/plugins/advanced-gutenberg/assets/js/slick.min.js?ver=5.3.2',
      '//www.instagram.com/embed.js' // retrigger instagram
    ).then(() => {
      // execute advance-gutenberg inner script

      const jQuery = require('jquery')

      // accordion
      jQuery(document).ready(function ($) {
        $('.advgb-accordion-wrapper').each(function () {
          $(this).accordion({
            header: '> div > .advgb-accordion-header',
            heightStyle: 'content',
            collapsible: true,
            active: $(this).data('collapsed') ? false : 0,
          })
        })
      })

      // slider
      jQuery(document).ready(function ($) {
        $('.advgb-images-slider-block .advgb-images-slider:not(.slick-initialized)').slick({
          dots: true,
          adaptiveHeight: true,
        })
      })
    })

    // execute anchor fixing
    const linkAnchorFixedHeader = require('~/assets/scripts/link-anchor-fixed-header')
    linkAnchorFixedHeader()
  },
  methods: {
    gutenbergLinks() {
      return [
        {
          rel: 'stylesheet',
          hid: 'blocks_library-css',
          href: `${this.wordpressUrl}/wp-includes/css/dist/block-library/style.min.css`,
        },
        {
          rel: 'stylesheet',
          hid: 'advgb_blocks_styles-css',
          href: `${this.wordpressUrl}/wp-content/plugins/advanced-gutenberg/assets/css/blocks_styles/blocks.css?ver=5.3.2`,
        },
        {
          rel: 'stylesheet',
          hid: 'advgb_material_icon_font-css',
          href: `${this.wordpressUrl}/wp-content/plugins/advanced-gutenberg/assets/css/fonts/material-icons.min.css?ver=5.3.2`,
        },
        {
          rel: 'stylesheet',
          hid: 'advgb_colorbox_style-css',
          href: `${this.wordpressUrl}/wp-content/plugins/advanced-gutenberg/assets/css/colorbox.css?ver=2.3.5`,
        },
        {
          rel: 'stylesheet',
          hid: 'advgb_slick_style-css',
          href: `${this.wordpressUrl}/wp-content/plugins/advanced-gutenberg/assets/css/slick.css?ver=5.3.2`,
        },
        {
          rel: 'stylesheet',
          hid: 'advgb_slick_theme_style-css',
          href: `${this.wordpressUrl}/wp-content/plugins/advanced-gutenberg/assets/css/slick-theme.css?ver=5.3.2`,
        },
        {
          rel: 'stylesheet',
          hid: 'advgb_bulma_styles-css',
          href: `${this.wordpressUrl}/wp-content/plugins/advanced-gutenberg/assets/css/bulma.min.css?ver=5.3.2`,
        },
        {
          rel: 'stylesheet',
          hid: 'dashicons-css',
          href: `${this.wordpressUrl}/wp-includes/css/dashicons.css?ver=5.3.2`,
        },
      ]
    },
  },
}
