<template>
  <v-card color="white" class="text-center mx-auto py-5" width="300">
    <v-card-title class="justify-center text-uppercase">
      <h3 class="valeur-title">{{ value.name }}</h3>
    </v-card-title>
    <Media :media="value.image" size="medium" height="200" contain class="mx-auto" flat></Media>
    <v-card-text class="text-body-1">{{ value.description }}</v-card-text>
    <v-card-actions class="justify-center">
      <v-btn text nuxt to="/articles" class="text-decoration-underline">en savoir plus</v-btn>
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

<style lang="scss" scoped></style>
