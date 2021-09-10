<template>
  <v-card hover ripple :to="`/fiche/${fiche.slug}`" nuxt>
    <WpMediaNew :media="fiche.image" size="medium_large" aspect-ratio="1" width="60vw">
      <v-chip v-if="fiche.isChouquettise" color="cq-yellow" text-color="black" small class="ma-2" style="position: absolute; top: 0px; left: 0px;">
        Testé et Chouquettisé
        <v-icon right>mdi-check</v-icon>
      </v-chip>
    </WpMediaNew>
    <v-card-title
      ><h3 class="text-h3 text-break primary--text">{{ fiche.title }}</h3></v-card-title
    >
    <v-card-subtitle class="text-uppercase text-left">
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
