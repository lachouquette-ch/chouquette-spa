<template>
  <v-container fluid>
    <h1 class="text-center mb-5">
      Oups, impossible de trouver ta page... <v-icon large>mdi-emoticon-sad-outline</v-icon>
    </h1>
    <p>Tu cherches...</p>
    <Search />
  </v-container>
</template>

<script>
import Search from '~/components/Search'

export default {
  components: { Search },
}
</script>

<style scoped>
a {
  text-decoration: underline;
}
</style>
