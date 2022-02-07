<template>
  <v-card color="white" class="text-center mx-auto py-5 d-flex flex-column" width="300" height="500">
    <v-card-title class="justify-center text-uppercase">
      <h3 class="valeur-title">{{ value.name }}</h3>
    </v-card-title>
    <div class="px-5">
      <Media :media="value.image" size="medium" contain class="mx-auto" flat></Media>
    </div>
    <v-card-text class="text-body-1">{{ value.description }}</v-card-text>
    <v-spacer></v-spacer>
    <v-card-actions class="justify-center align-self-">
      <v-btn
        text
        nuxt
        :to="`/label-la-chouquettisation-ecoresponsable-chouquette-valeurs-suisse-romande-vaud-guide-local-ecologie#valeur-${value.slug}`"
        class="text-decoration-underline"
        >en savoir +</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import Media from '~/components/Media'

export default {
  components: { Media },
  props: {
    value: Object,
  },
}
</script>

<style lang="scss" scoped>
h3 {
  font-family: $secondary-font-family !important;
  letter-spacing: 1.5px !important;
  border: 1px solid black;
  padding: 5px 10px;
}
</style>
