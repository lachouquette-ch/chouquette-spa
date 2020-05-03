<template>
  <div>
    <h1 class="text-center mb-5">Oups, impossible de trouver ta page... <i class="far fa-surprise"></i></h1>
    <p>Tu cherches quelque chose ? C'est pas ici :</p>
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
