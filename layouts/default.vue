<template>
  <v-app>
    <v-navigation-drawer v-if="!$vuetify.breakpoint.mobile" v-model="toggleMenu" temporary app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Application </v-list-item-title>
          <v-list-item-subtitle> subtext </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar fixed dark app>
      <v-app-bar-nav-icon class="hidden-xs-only primary--text" @click="toggleMenu = !toggleMenu"></v-app-bar-nav-icon>

      <v-app-bar-title><h1 class="app-bar-title text-h5 primary--text">La Chouquette</h1></v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon class="primary--text">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main class="overflow-y-auto">
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="pa-0 min-vh-100 d-flex flex-column">
        <nuxt></nuxt>
        <CqFooter class="mt-auto"></CqFooter>
      </v-container>
    </v-main>

    <v-bottom-navigation v-model="selectedNav" dark fixed app color="primary">
      <v-btn>
        <span>Accueil</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn>
        <span>Addresses</span>
        <v-icon>mdi-map-marker-multiple-outline</v-icon>
      </v-btn>

      <v-btn>
        <span>Articles</span>
        <v-icon>mdi-newspaper-variant-multiple</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <client-only>
      <cookie-consent v-if="showCookieConsent" aria-label="Cookie Preferences" aria-live="polite">
        <template slot="message">
          <span class="white--text mx-3">
            Ici, on aime les Cookies <v-icon color="white">mdi-cookie</v-icon>, mais pas plus qu'il n'en faut !
            <nuxt-link to="/politique-de-confidentialite">En savoir plus</nuxt-link>
          </span>
        </template>
        <template slot="button">
          <v-btn class="my-2" color="white">J'accepte<v-icon right> mdi-thumb-up-outline </v-icon></v-btn>
        </template>
      </cookie-consent>
    </client-only>
  </v-app>
</template>

<script>
import CookieConsent from 'vue-cookieconsent-component'
import isbot from 'isbot'
import CqFooter from '~/components/CqFooter'

export default {
  components: { CqFooter, CookieConsent },
  async middleware({ store }) {
    if (process.client) {
      await store.dispatch('nuxtServerInit')
    }
  },
  data() {
    return {
      showCookieConsent: false,
      toggleMenu: false,
      selectedNav: undefined,
    }
  },
  computed: {
    displayDrawer() {
      return this.$vuetify.breakpoint.mobile && this.drawer
    },
    isIndex() {
      return this.$route.name === 'index'
    },
  },
  mounted() {
    this.showCookieConsent = !isbot(navigator.userAgent)
  },
}
</script>

<style lang="scss" scoped></style>
