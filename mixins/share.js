export default {
  computed: {
    shareApiAvailable() {
      return typeof navigator.share === 'function'
    },
  },
  methods: {
    shareWith(title, text, url) {
      return navigator.share({ title, text, url }).catch((error) => {
        if (error.name === 'AbortError') {
          console.info('action canceled by user')
        } else {
          throw error
        }
      })
    },
  },
}
