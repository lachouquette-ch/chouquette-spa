<template>
  <v-list>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h3">{{ title }}</v-list-item-title>
        <v-list-item-subtitle v-if="selectedIndexes.length" class="mt-1"
          >{{ selectedIndexes.length }} sélectionné(s) -
          <a href="" @click.prevent="clear">Effacer</a></v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>
    <v-list-item-group v-model="selectedIndexes" active-class="" multiple>
      <v-list-item v-for="item in displayedItems" :key="item.id" active-class="" dense>
        <template #default="{ active }">
          <v-list-item-content>
            <v-list-item-title>
              <slot :item="item">
                {{ item.name }}
              </slot>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="ma-0">
            <v-checkbox :input-value="active" hide-details></v-checkbox>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list-item-group>
    <v-container fluid>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto py-0">
          <template v-if="items.length > foldedCount">
            <a v-if="folded" href="" @click.prevent="folded = false">Afficher tout</a>
            <a v-else href="" @click.prevent="folded = true">Masquer</a>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-list>
</template>

<script>
export default {
  props: {
    title: String,
    items: Array,
    value: Array,
    foldedCount: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      folded: true,
      selectedIndexes: [],
      selectedSlugs: this.value,
    }
  },
  computed: {
    displayedItems() {
      return this.folded ? this.items.slice(0, this.foldedCount) : this.items
    },
  },
  watch: {
    selectedIndexes() {
      this.selectedSlugs = this.selectedIndexes.map((i) => this.items[i].slug)
      this.$emit('input', this.selectedSlugs)
      this.$emit('updateCount', this.selectedSlugs.length)
    },
  },
  mounted() {
    // initialize
    this.selectedIndexes = this.selectedSlugs.map((selectedSlug) => {
      return this.items.findIndex(({ slug }) => slug === selectedSlug)
    })
  },
  methods: {
    clear() {
      this.selectedIndexes = []
    },
  },
}
</script>

<style lang="scss" scoped>
// hack since active-class property does not work
.theme--light.v-list-item--active:hover::before,
.theme--light.v-list-item--active::before {
  opacity: 0;
}
</style>
