<template>
  <v-card hover ripple width="200" max-width="60vw" v-bind="{ ...$props, ...$attrs }">
    <WpMedia :media="fiche.image" size="medium_large" height="200">
      <v-card-subtitle v-if="fiche.isChouquettise" class="pa-2">
        <v-chip color="cq-yellow" text-color="black" small>
          Testé et Chouquettisé
          <v-icon right>mdi-check</v-icon>
        </v-chip>
      </v-card-subtitle>
    </WpMedia>
    <v-card-title class="d-block">
      <h3>{{ fiche.title }}</h3>
      <v-card-subtitle class="pa-0 mt-1 secondary--text">
        <span v-if="fiche.locationId">{{ getLocationById(fiche.locationId).name }} - </span>
        {{ getCategoryById(fiche.principalCategoryId).name }}
      </v-card-subtitle>
    </v-card-title>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import WpMedia from '~/components/WpMedia'

export default {
  components: {WpMedia},
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
