<template>
  <div class="error layout-content d-flex justify-content-center align-items-center px-3 pb-3">
    <component :is="errorComponent" :message="message" />
  </div>
</template>

<script>
import Search from '~/components/Search'
import Error from '~/components/Error'
import Error404 from '~/components/Error404'
import Error410 from '~/components/Error410'

export default {
  components: { Search, Error, Error404, Error410 },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      from: null
    }
  },
  computed: {
    errorComponent() {
      const name = 'Error' + this.statusCode
      return this.$options.components[name] ? name : 'Error'
    },
    statusCode() {
      if (this.error.isAxiosError) {
        return this.error.response.status
      } else {
        return (this.error && this.error.statusCode) || 500
      }
    },
    message() {
      return this.error.message
    }
  },
  created() {
    console.error(this.message, this.error)
  }
}
</script>

<style lang="scss" scoped>
.error {
  h1 {
    font-family: $font-family-heading;
  }
}
</style>
