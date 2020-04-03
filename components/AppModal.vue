<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="modalLabel" class="modal-title">{{ title }}</h5>
          <button type="button" class="close" aria-label="Fermer" @click="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot>
            Modal body
          </slot>
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    show() {
      this.modal.toggle()
    }
  },
  mounted() {
    const Modal = require('bootstrap/js/dist/modal')
    this.modal = new Modal(this.$el)
  },
  beforeDestroy() {
    this.modal.close()
    this.modal.dispose()
  },
  methods: {
    close() {
      this.modal.hide()
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  color: $white;

  .close {
    color: $chouquette-yellow;
    opacity: 1;
    text-shadow: none;
  }

  .modal-content {
    background-color: rgba($black, 0.8);
  }
}
</style>
