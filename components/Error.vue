<template>
  <v-container fluid>
    <h1 class="text-center mb-5">
      Aïe, une erreur s'est produite... <v-icon large>mdi-emoticon-confused-outline</v-icon>
    </h1>
    <h2>Tu veux vite sortir de là ? <i class="fas fa-running"></i></h2>
    <p>
      Alors reviens à la <a href="" @click.prevent="$router.go(-1)">page précédente</a> ou tente ta chance en
      <a href="">rechargeant la page</a> <i class="fas fa-dice"></i>
    </p>
    <p>
      Tu peux aussi aller sur la <nuxt-link to="/">page d'accueil</nuxt-link> pour découvrir nos dernières nouveautés
      <i class="far fa-smile-wink"></i>
    </p>
    <h2>L'erreur persiste ? <i class="far fa-angry"></i></h2>
    <p>
      <nuxt-link to="/contact">Ecris-nous</nuxt-link> pour nous en informer
      <i class="far fa-thumbs-up"></i>
    </p>
    <v-expansion-panels flat tile style="width: 300px">
      <v-expansion-panel>
        <v-expansion-panel-header color="error lighten-1">Détails de l'erreur</v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ message }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      messageVisible: null,
    }
  },
}
</script>

<style scoped></style>
