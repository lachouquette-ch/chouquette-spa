module.exports = (offsetHeightPx = 160) => {
  //  from https://stackoverflow.com/questions/10732690/offsetting-an-html-anchor-to-adjust-for-fixed-header
  ;(function(document, history, location) {
    const $ = require('jquery')

    const HISTORY_SUPPORT = !!(history && history.pushState)

    const anchorScrolls = {
      ANCHOR_REGEX: /^#[^ ]+$/,

      /**
       * Establish events, and fix initial scroll position if a hash is provided.
       */
      init() {
        this.scrollToCurrent()
        $(window).on('hashchange', $.proxy(this, 'scrollToCurrent'))
        $('body').on('click', 'a', $.proxy(this, 'delegateAnchors'))
      },

      /**
       * Return the offset amount to deduct from the normal scroll position.
       * Modify as appropriate to allow for dynamic calculations
       */
      getFixedOffset() {
        return offsetHeightPx
      },

      /**
       * If the provided href is an anchor which resolves to an element on the
       * page, scroll to it.
       * @param  {String} href
       * @return {Boolean} - Was the href an anchor.
       */
      scrollIfAnchor(href, pushToHistory) {
        let anchorOffset

        if (!this.ANCHOR_REGEX.test(href)) {
          return false
        }

        const match = document.getElementById(href.slice(1))

        if (match) {
          anchorOffset = $(match).offset().top - this.getFixedOffset()
          $('html, body').animate({ scrollTop: anchorOffset })

          // Add the state to history as-per normal anchor links
          if (HISTORY_SUPPORT && pushToHistory) {
            history.pushState({}, document.title, location.pathname + href)
          }
        }

        return !!match
      },

      /**
       * Attempt to scroll to the current location's hash.
       */
      scrollToCurrent(e) {
        if (this.scrollIfAnchor(window.location.hash) && e) {
          e.preventDefault()
        }
      },

      /**
       * If the click event's target was an anchor, fix the scroll position.
       */
      delegateAnchors(e) {
        const elem = e.target

        if (this.scrollIfAnchor(elem.getAttribute('href'), true)) {
          e.preventDefault()
        }
      }
    }

    $(document).ready($.proxy(anchorScrolls, 'init'))
  })(window.document, window.history, window.location)
}
