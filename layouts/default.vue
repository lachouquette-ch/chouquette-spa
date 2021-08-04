<template>
  <v-app>
    <v-navigation-drawer v-model="displayDrawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Application </v-list-item-title>
          <v-list-item-subtitle> subtext </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar fixed dark app class="app-bar">
      <v-app-bar-nav-icon class="hidden-xs-only primary--text" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title><h1 class="app-bar-title text-h5 primary--text">La Chouquette</h1></v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon class="primary--text">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main class="overflow-y-auto">
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="min-vh-100">
        <nuxt></nuxt>
        <v-card flat tile class="text-center">
          <v-card-text>
            <v-btn class="mx-4" icon>
              <v-icon size="24px">mdi-facebook</v-icon>
            </v-btn>
            <v-btn class="mx-4" icon>
              <v-icon size="24px">mdi-instagram</v-icon>
            </v-btn>
          </v-card-text>

          <v-card-text class="pt-0">
            Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent
            ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet
            dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum
            ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci
            varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text class=""> {{ new Date().getFullYear() }} — <strong>Vuetify</strong> </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <v-bottom-navigation v-model="navigation" dark fixed app>
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

export default {
  components: { CookieConsent },
  async middleware({ store }) {
    if (process.client) {
      await store.dispatch('nuxtServerInit')
    }
  },
  data() {
    return {
      showCookieConsent: false,
      drawer: null,
      navigation: undefined,
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

<style lang="scss" scoped>
button.v-btn.v-btn--active.v-btn--is-elevated.v-btn--has-bg.theme--dark.v-size--default {
  color: $chouquette-yellow;
}
</style>
