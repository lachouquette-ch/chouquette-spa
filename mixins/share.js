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
      return navigator.share({ title, text, url })
    },
  },
}
