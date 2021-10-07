<template>
  <div>
    <div v-if="$vuetify.breakpoint.mobile" :id="id" class="scroll-x-container">
      <div v-for="item in items" :key="item[itemId]">
        <slot :item="item"></slot>
      </div>
    </div>
    <v-container v-else-if="!mobileOnly" :id="id">
      <v-row>
        <v-col v-for="item in items" :key="item[itemId]" :cols="cols" :md="md">
          <slot :item="item"></slot>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    id: String,
    itemId: { type: String, default: 'id' },
    mobileOnly: Boolean,
    cols: { type: [String, Number], default: 12 },
    md: { type: [String, Number], default: 6 },
  },
  data() {
    return {
      item: null,
    }
  },
}
</script>

<style lang="scss" scoped>
.scroll-x-container {
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 30px;
  display: flex;
  padding-bottom: 0.75rem;

  > * {
    scroll-snap-align: start;

    &:not(:last-child) {
      margin-right: 0.75rem;
    }
  }
}
</style>
