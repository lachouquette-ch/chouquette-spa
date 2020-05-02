<template>
  <div class="error layout-content d-flex justify-content-center align-items-center">
    <div v-if="error.statusCode === 404">
      <h1 class="text-center mb-5">Oups, impossible de trouver ta page... <i class="far fa-surprise"></i></h1>
      <p>Tu cherches quelque chose ? C'est pas ici :</p>
      <Search />
    </div>
    <div v-else-if="error.statusCode === 410">
      <h1 class="text-center mb-5">Désolé, la page que tu cherches n'exite plus... <i class="far fa-trash-alt"></i></h1>
      <p>Retourne sur la <nuxt-link to="/">page d'accueil</nuxt-link> et découvre nos dernières nouveautés</p>
      <Search />
    </div>
    <div v-else>
      <h1 class="text-center mb-5">Aïe, une erreur s'est produite... <i class="far fa-frown"></i></h1>
      <h2>Tu veux vite sortir de là ? <i class="fas fa-running"></i></h2>
      <p>
        Alors reviens à la <a href="" @click.prevent="$router.go(-1)">page précédente</a> ou tente ta chance et
        <a href="">recherche la page</a> <i class="fas fa-redo"></i>
      </p>
      <p>
        Tu peux aussi aller sur la <nuxt-link to="/">page d'accueil</nuxt-link> pour découvrir nos dernières nouveautés
        <i class="far fa-smile-wink"></i>
      </p>
      <h2>L'erreur persiste ? <i class="fas fa-angry"></i></h2>
      <p>
        <nuxt-link to="/contact">Ecris-nous</nuxt-link> pour nous informer de cette erreur
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
  </div>
</template>

<script>
import Search from '~/components/Search'
export default {
  components: { Search },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      from: null,
      messageVisible: false
    }
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      return this.error.message
    }
  }
}
</script>

<style lang="scss" scoped>
.error {
  h1 {
    font-family: $font-family-heading;
  }
}
</style>
