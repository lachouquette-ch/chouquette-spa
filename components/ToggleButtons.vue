<template>
  <div class="toggle-buttons">
    <div class="btn-group btn-group-toggle">
      <button class="btn btn-sm btn-primary" :class="{ active: !toggled }" :disabled="btn1disabled" @click="btn1action">
        <slot name="button1">
          <span class="mr-1"><i class="fas fa-dice-one"></i></span>
          Button 1
        </slot>
      </button>
      <button class="btn btn-sm btn-primary" :class="{ active: toggled }" :disabled="btn2disabled" @click="btn2action">
        <slot name="button2">
          <span class="mr-1"><i class="fas fa-dice-two"></i></span>
          Button 2
        </slot>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    btn1disabled: Boolean,
    btn2disabled: Boolean,
  },
  data() {
    return {
      toggled: false,
    }
  },
  methods: {
    btn1action() {
      this.toggled = false
      this.$emit('btn1action')
    },
    btn2action() {
      this.toggled = true
      this.$emit('btn2action')
    },
  },
}
</script>

<style lang="scss" scoped>
.toggle-buttons {
  position: sticky;
  bottom: 10px;
  left: 50%;
  text-align: center;
  z-index: $zindex-fixed + 1;

  display: inline-block;
  transform: translateX(-50%);
  margin-bottom: 10px;

  button:focus {
    box-shadow: none !important;
  }

  @include media-breakpoint-up(md) {
    position: fixed;
    top: $header-height + $covid-banner-height + 15px;
    bottom: auto;
    left: 15px;

    transform: none;
  }
}
</style>
