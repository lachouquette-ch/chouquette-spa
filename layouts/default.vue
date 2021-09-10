<template>
  <v-app>
    <LayoutAlert></LayoutAlert>

    <v-system-bar color="primary" class="cq-blue--text" app height="30"
      ><span>En savoir plus + highlight titre</span></v-system-bar
    >

    <v-navigation-drawer v-model="toggleMenu" temporary app right>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            ><h1 class="text-h6">{{ name }}</h1></v-list-item-title
          >
          <v-list-item-subtitle>{{ description }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar fixed app>
      <template v-if="!toggleSearch">
        <img src="/lachouquette_logo_horizontal_black.png" alt="La Chouquette" height="100%" class="py-2" />

        <v-spacer></v-spacer>

        <v-btn icon class="primary--text" small @click="toggleSearch = true">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-app-bar-nav-icon class="primary--text" @click="toggleMenu = !toggleMenu"></v-app-bar-nav-icon>
      </template>
      <transition name="fade">
        <v-text-field
          v-if="toggleSearch"
          v-model="search"
          placeholder="Je cherche..."
          solo
          autofocus
          prepend-icon="mdi-close"
          append-outer-icon="mdi-send"
          clear-icon="mdi-close-circle-outline"
          rounded
          clearable
          hide-details
          flat
          class="w-100"
          @click:prepend="toggleSearch = false"
        ></v-text-field>
      </transition>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="pa-0 min-vh-100 d-flex flex-column">
        <nuxt></nuxt>
        <CqFooter class="mt-auto"></CqFooter>
      </v-container>
    </v-main>

    <v-bottom-navigation v-model="selectedNav" fixed app color="cq-red">
      <v-btn nuxt to="/">
        <span>Accueil</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn nuxt to="/fiches">
        <span>Adresses</span>
        <v-icon>mdi-map-marker-multiple-outline</v-icon>
      </v-btn>

      <v-btn nuxt to="/articles">
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
import { mapState } from 'vuex'
import CqFooter from '~/components/CqFooter'
import LayoutAlert from '~/components/LayoutAlert'

export default {
  components: { LayoutAlert, CqFooter, CookieConsent },
  async middleware({ store }) {
    await store.dispatch('nuxtServerInit')
  },
  data() {
    return {
      showCookieConsent: false,

      toggleMenu: false,
      toggleSearch: false,
      search: null,

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
    ...mapState(['name', 'description']),
  },
  mounted() {
    this.showCookieConsent = !isbot(navigator.userAgent)
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave {
  opacity: 0;
}

.v-app-bar-title__content {
  display: flex;
  align-content: center;
}
</style>
