<template>
  <v-card class="transparent" flat hover ripple :to="`/fiche/${fiche.slug}`" nuxt>
    <WpMediaNew :media="fiche.image" size="medium_large" class="rounded" aspect-ratio="1" width="60vw"></WpMediaNew>
    <v-card-title class="pa-0 pt-1"
      ><h2 class="text-h6 text-break black--text" style="line-height: 1.5rem">{{ fiche.title }}</h2></v-card-title
    >
    <v-card-subtitle class="pa-0 ma-0 text-uppercase">
      <span v-if="fiche.locationId">{{ getLocationById(fiche.locationId).name }} / </span>
      {{ getCategoryById(fiche.principalCategoryId).name }}
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import WpMediaNew from '~/components/WpMediaNew'

export default {
  components: { WpMediaNew },
  props: {
    fiche: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapGetters('categories', {
      getCategoryById: 'getById',
    }),
    ...mapGetters('locations', {
      getLocationById: 'getById',
    }),
  },
}
</script>

<style lang="scss" scoped></style>
