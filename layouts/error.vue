<template>
  <v-sheet class="error lighten-2 pa-3">
    <component :is="errorComponent" :message="message" />
  </v-sheet>
</template>

<script>
import Error from '~/components/Error'
import Error404 from '~/components/Error404'
import Error410 from '~/components/Error410'

export default {
  components: { Error, Error404, Error410 },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      from: null,
    }
  },
  computed: {
    errorComponent() {
      const name = 'Error' + this.error.statusCode
      return this.$options.components[name] ? name : 'Error'
    },
    message() {
      return this.error.message
    },
  },
  created() {
    // eslint-disable-next-line no-console
    console.error(this.message, this.error)
  },
}
</script>

<style lang="scss" scoped>
.error {
  h1 {
    font-family: $secondary-font-family;
  }
}
</style>
