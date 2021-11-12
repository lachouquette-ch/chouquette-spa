export default {
  data() {
    return {
      shareApiAvailable: false,
    }
  },
  mounted() {
    this.shareApiAvailable = typeof navigator.share === 'function'
  },
  methods: {
    shareWith(title, text, url) {
      try {
        return navigator.share({ title, text, url })
      } catch (e) {
        // skip user abording share
        if (e instanceof DOMException && e.code === DOMException.ABORT_ERR) {
          console.log(e)
        } else {
          throw e
        }
      }
    },
  },
}
