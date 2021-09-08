<template>
  <button
    v-ripple
    class="top-category-btn rounded"
    :class="{ 'grey darken-3': selected }"
    :disabled="disabled"
    @click.prevent="$emit('click', topCategory)"
  >
    <v-list-item two-line>
      <v-list-item-avatar class="rounded-0">
        <WpMediaNew v-if="selected" :media="topCategory.logoWhite" size="thumbnail"></WpMediaNew>
        <WpMediaNew v-else :media="topCategory.logoBlack" size="thumbnail"></WpMediaNew>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title :class="{ 'yellow--text': selected }">{{ topCategory.name }}</v-list-item-title>
        <v-list-item-subtitle :class="{ 'white--text': selected }">{{ topCategory.description }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </button>
</template>

<script>
import WpMediaNew from '~/components/WpMediaNew'

export default {
  components: { WpMediaNew },
  props: {
    topCategory: Object,
    selected: Boolean,
    disabled: Boolean,
  },
}
</script>

<style scoped></style>
