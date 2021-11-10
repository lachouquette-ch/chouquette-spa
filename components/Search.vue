<template>
  <v-list-item-group v-model="selectedItem" color="primary">
    <v-list-item to="/adresses" nuxt>
      <v-list-item-icon><v-icon>mdi-map-marker-multiple-outline</v-icon></v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Des adresses ?</v-list-item-title>
        <v-list-item-subtitle class="text-decoration-underline">C'est pas ici</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item to="/articles" nuxt>
      <v-list-item-icon><v-icon>mdi-newspaper-variant-multiple</v-icon></v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Des articles ?</v-list-item-title>
        <v-list-item-subtitle class="text-decoration-underline">C'est pas là</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item to="/" nuxt>
      <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Aucune idée ?</v-list-item-title>
        <v-list-item-subtitle class="text-decoration-underline">Alors laisse toi guider...</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</template>

<script>
export default {}
</script>

<style scoped></style>
