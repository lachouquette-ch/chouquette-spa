<template>
  <div>
    {{ fiche.title.rendered }}
  </div>
</template>

<script>
export default {
  props: {
    fiche: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
