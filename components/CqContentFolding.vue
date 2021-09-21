<template>
  <div>
    <div :class="{ folded: folded }">
      <slot></slot>
    </div>
    <div v-if="folded" class="text-center">
      <v-btn color="primary" class="text-center" @click="folded = false">{{ btnContent }}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    btnContent: {
      type: String,
      default: 'Lire la suite',
    },
  },
  data() {
    return {
      folded: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.folded {
  position: relative;
  height: 300px;
  overflow: hidden;

  &:after {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    content: '';
    background: linear-gradient(180deg, transparent 60%, white);
    pointer-events: none;
  }
}
</style>
