<template>
  <span>{{ formatedDateTime }}</span>
</template>

<script>
import moment from 'moment'

export default {
  name: 'MomentDateTime',
  props: {
    datetime: {
      required: true,
      type: Date
    },
    format: {
      type: String,
      default: 'DD/MM/YY'
    }
  },
  computed: {
    formatedDateTime() {
      const momentDate = moment(this.datetime)
      return momentDate.format(this.format)
    }
  }
}
</script>

<style scoped></style>
