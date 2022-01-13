<template>
  <button
    v-ripple
    class="top-category-btn rounded-lg border-1"
    :class="{ primary: selected }"
    :disabled="disabled"
    @click.prevent="$emit('click', topCategory)"
  >
    <v-list-item two-line>
      <v-list-item-avatar class="rounded-0">
        <Media v-if="selected" :media="topCategory.logoWhite" size="thumbnail"></Media>
        <Media v-else :media="topCategory.logoBlack" size="thumbnail"></Media>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title :class="[selected ? 'cq-yellow--text' : 'black--text']">{{
          topCategory.name
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </button>
</template>

<script>
import Media from '~/components/Media'

export default {
  components: { Media },
  props: {
    topCategory: Object,
    selected: Boolean,
    disabled: Boolean,
  },
}
</script>

<style lang="scss" scoped>
.top-category-btn {
  width: 190px;
  background-color: white;
  box-shadow: map-get($shadow-key-umbra, 4) !important;

  @include hover-focus-active {
    background-color: var(--v-primary-lighten5);
  }

  &:disabled,
  &button[disabled] {
    opacity: 0.6;
  }
}
</style>
