<template>
  <v-container tag="footer" fluid class="footer py-5">
    <!-- Stack the columns on mobile by making one full-width and the other half-width -->
    <div class="cq-md-max-width">
      <v-row class="text-center">
        <v-col cols="6" md="4">
          <h5 class="cq-blue--text mb-3">{{ aboutMenu.name }}</h5>
          <ul>
            <li v-for="item in aboutMenu.items" :key="item.id">
              <nuxt-link class="primary--text text--lighten-5 text-decoration-none" :to="`/${item.slug}`">{{
                item.title
              }}</nuxt-link>
            </li>
          </ul>
        </v-col>
        <v-col cols="6" md="4">
          <h5 class="cq-blue--text mb-3">{{ contactMenu.name }}</h5>
          <ul>
            <li v-for="item in contactMenu.items" :key="item.id">
              <nuxt-link class="primary--text text--lighten-5 text-decoration-none" :to="`/${item.slug}`">{{
                item.title
              }}</nuxt-link>
            </li>
          </ul>
          <v-btn icon large target="_blank" href="https://www.facebook.com/lachouquette.ch"
            ><v-icon large color="#4267b2">mdi-facebook</v-icon></v-btn
          >
          <v-btn icon large target="_blank" href="https://www.instagram.com/lachouquette.ch"
            ><v-icon large color="#E1306C">mdi-instagram</v-icon></v-btn
          >
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <nuxt-link to="/">
            <v-img
              src="/logo.png"
              transition="false"
              alt="Logo Chouquette"
              contain
              width="150"
              height="150"
              class="mx-auto"
            ></v-img>
          </nuxt-link>
        </v-col>
      </v-row>
      <v-divider class="secondary my-4"></v-divider>
      <p class="text-center text-caption primary--text text--lighten-5">
        <nuxt-link to="/mentions-legales" class="primary--text text--lighten-5">Mentions légales</nuxt-link> -
        <nuxt-link to="/politique-de-confidentialite" class="primary--text text--lighten-5">Politique de confidentialité</nuxt-link>
      </p>
      <p class="text-center text-caption">
        Copyright 2014-{{ currentYear }} - Tous droits réservés à La Chouquette. Toutes les images et le contenu sont la
        propriété du site.
      </p>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapGetters('menus', {
      aboutMenu: 'getAboutMenu',
      contactMenu: 'getContactMenu',
    }),
    ...mapState('menus', {
      menus: 'all',
    }),
    ...mapState(['wordpressUrl']),
    currentYear() {
      return moment().format('YYYY')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles';

.footer {
  background-color: var(--v-cq-grey-base);
  color: var(--v-cq-grey-light-base);

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
    color: var(--v-cq-grey-light-base);
  }
}
</style>
