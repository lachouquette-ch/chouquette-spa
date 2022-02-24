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
    async shareWith(title, text, url) {
      try {
        return await navigator.share({ title, text, url })
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
