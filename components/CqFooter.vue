<template>
  <v-container tag="footer" fluid class="footer">
    <!-- Stack the columns on mobile by making one full-width and the other half-width -->
    <v-row class="text-center">
      <v-col cols="6" md="4">
        <h5 class="primary--text font-weight-light mb-3">A propos de nous</h5>
        <ul>
          <li>Qui sommes-nous ?</li>
          <li>Nos valeurs</li>
        </ul>
      </v-col>
      <v-col cols="6" md="4">
        <h5 class="primary--text font-weight-light mb-3">Aides</h5>
        <ul>
          <li>Foire aux questions</li>
          <li>Contact</li>
        </ul>
      </v-col>
      <v-col cols="6" md="4">
        <h5 class="primary--text font-weight-light mb-3">Nous contacter</h5>
        <ul>
          <li>Recrutement</li>
          <li>Contact</li>
        </ul>
      </v-col>
      <v-col cols="6" md="12" class="p5">
        <v-img
          :aspect-ratio="1 / 1"
          :lazy-src="`${wordpressUrl}/wp-content/uploads/2019/03/logo_white-150x150.png`"
          :src="`${wordpressUrl}/wp-content/uploads/2019/03/logo_white-768x706.png`"
          transition="false"
          alt="Logo Chouquette"
          contain
          width="75%"
          max-width="300px"
          class="mx-auto"
        ></v-img>
      </v-col>
    </v-row>
    <hr class="my-4" />
    <p class="text-center">
      Copyright 2014-{{ currentYear }} - Tous droits réservés à La Chouquette. Toutes les images et le contenu sont la
      propriété du site.
    </p>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState('menus', {
      pages: 'footerPages',
    }),
    currentYear() {
      return moment().format('YYYY')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles';

.footer {
  background-color: $chouquette-dark-grey;
  color: $chouquette-light-grey;

  h5 {
    font-size: 1.1rem;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 0.5rem;
    }
  }

  hr {
    color: $chouquette-light-grey;
  }
}
</style>
