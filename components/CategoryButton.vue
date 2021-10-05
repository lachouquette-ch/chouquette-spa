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
        <WpMedia v-if="selected" :media="topCategory.logoWhite" size="thumbnail"></WpMedia>
        <WpMedia v-else :media="topCategory.logoBlack" size="thumbnail"></WpMedia>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title :class="[selected ? 'cq-yellow--text' : 'black--text']">{{
          topCategory.name
        }}</v-list-item-title>
        <v-list-item-subtitle :class="[selected ? 'white--text' : 'black--text']">{{
          topCategory.description
        }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </button>
</template>

<script>
import WpMedia from '~/components/WpMedia'

export default {
  components: {WpMedia},
  props: {
    topCategory: Object,
    selected: Boolean,
    disabled: Boolean,
  },
}
</script>

<style lang="scss" scoped>
.top-category-btn {
  width: 200px;
  border: 1px solid grey;

  @include hover-focus-active {
    background-color: var(--v-primary-lighten5);
  }

  &:disabled,
  &button[disabled] {
    opacity: 0.6;
  }
}
</style>
