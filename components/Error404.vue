<template>
  <div>
    <h1 class="text-center mb-5">Oups, impossible de trouver ta page... <i class="far fa-grimace"></i></h1>
    <p>Tu cherches quelque chose ? C'est par ici :</p>
    <Search />
  </div>
</template>

<script>
import Search from './Search'

export default {
  components: { Search },
}
</script>

<style scoped>
a {
  text-decoration: underline;
}
</style>
