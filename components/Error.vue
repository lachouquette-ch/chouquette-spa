<template>
  <div>
    <h1 class="text-center mb-5">Aïe, une erreur s'est produite... <i class="far fa-grin-beam-sweat"></i></h1>
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
    <button v-b-toggle.error-details class="btn btn-secondary">
      <span class="mr-2">Détails de l'erreur</span>
      <i v-if="messageVisible" class="fas fa-minus"></i>
      <i v-else class="fas fa-plus"></i>
    </button>
    <b-collapse id="error-details" v-model="messageVisible" class="mt-3 p-2 border rounded">
      {{ message }}
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      messageVisible: false
    }
  }
}
</script>

<style scoped></style>
