export default {
  data() {
    return {
      mailChimpUserId: this.$config.mailChimpUserId,
      mailChimpListId: this.$config.mailChimpListId,
    }
  },
  methods: {
    onMailchimpSubscriptionError(errorMessage) {
      this.$store.dispatch('alerts/addAction', { type: 'error', message: errorMessage })
    },
    onMailchimpSubscriptionSuccess() {
      this.$store.dispatch('alerts/addAction', { type: 'success', message: "Tu t'es bien inscris, merci !" })
    },
  },
}
