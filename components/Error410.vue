<template>
  <div>
    <h1 class="text-center mb-5">
      Désolé, ce contenu a été supprimé de notre site... <i class="far fa-trash-alt"></i>
    </h1>
    <p>
      Retourne sur la <nuxt-link to="/">page d'accueil</nuxt-link> et découvre nos dernières nouveautés
      <i class="far fa-smile-wink"></i>
    </p>
    <p>Ou dis nous ce que tu cherches :</p>
    <Search />
  </div>
</template>

<script>
import Search from './Search'

export default {
  components: { Search }
}
</script>

<style scoped></style>
