<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

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
        Ce site internet a été développé par Fabrice Douchant. Il est sous licence AGPL-3.0-or-later <a href="https://github.com/fdouchant/chouquette-spa" target="_blank" class="primary--text text--lighten-5">(lien vers le repo Git officiel)</a>
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
