<template>
  <v-list>
    <v-subheader class="text-h6 black--text">{{ title }}</v-subheader>
    <transition-group name="slide">
      <v-list-item v-for="item in displayedItems" :key="item[itemKeyAttr]" dense>
        <v-list-item-title class="text-body-1">
          <slot :item="item">
            {{ item.name }}
          </slot>
        </v-list-item-title>
        <v-list-item-action class="ma-0">
          <v-checkbox hide-details :ripple="false"></v-checkbox>
        </v-list-item-action>
      </v-list-item>
    </transition-group>
    <div class="d-flex flex-row-reverse px-4 mt-2">
      <a v-if="folded" href="" @click.prevent="folded = false">Afficher tout</a>
      <a v-else href="" @click.prevent="folded = true">Masquer</a>
    </div>
  </v-list>
</template>

<script>
export default {
  props: {
    title: String,
    items: Array,
    itemKeyAttr: {
      type: String,
      default: 'id',
    },
    foldedCount: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      folded: true,
    }
  },
  computed: {
    displayedItems() {
      return this.folded ? this.items.slice(0, this.foldedCount) : this.items
    },
  },
}
</script>

<style scoped></style>
