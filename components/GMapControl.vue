<template>
  <button class="gmap-control" @click="handler" v-html="content" />
</template>

<script>
export default {
  props: {
    handler: {
      type: Function,
      required: true
    },
    content: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.gmap-control {
  margin: 10px;
  height: 40px;
  width: 40px;

  font-size: 16px;

  background-color: $white;
  border: none;

  box-shadow: $box-shadow;

  &:focus {
    outline: none;
  }
}
</style>
