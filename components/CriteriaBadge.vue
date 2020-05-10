<template>
  <a href="" class="badge badge-pill badge-light-grey font-weight-normal mr-1" @click.prevent="$emit('remove')">
    <i class="far fa-times-circle"></i> {{ name }}
  </a>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped></style>
