<template>
  <v-app>
    <LayoutAlert></LayoutAlert>

    <v-system-bar v-if="false" color="primary" class="cq-blue--text justify-center" app height="30">
      <span>Mon text pour system bar</span>
    </v-system-bar>

    <v-navigation-drawer v-model="toggleMenu" temporary app right touchless width="500">
      <v-card min-height="100vh" tile>
        <v-card-title>
          <h1 class="my-0 text-header--secondary">{{ name }}</h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="toggleMenu = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <p class="ml-3 text-body-2 font-weight-bold">{{ description }}</p>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <template v-if="!$vuetify.breakpoint.mobile">
            <v-list nav>
              <v-subheader class="text-h4 pl-1">Les racourcis</v-subheader>
              <v-list-item to="/" nuxt>
                <v-list-item-icon><v-icon color="black">mdi-home</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Accueil</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item to="/fiches" nuxt>
                <v-list-item-icon><v-icon color="black">mdi-map-marker-multiple-outline</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Adresses</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item to="/articles" nuxt>
                <v-list-item-icon><v-icon color="black">mdi-newspaper-variant-multiple</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Articles</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
          </template>

          <v-list nav>
            <v-subheader class="text-h4 pl-1">Les catégories</v-subheader>
            <v-list-item
              v-for="item in categoryMenu.items"
              :key="item.id"
              :to="`/fiches?category=${item.slug}`"
              nuxt
              class="mb-0"
            >
              <v-list-item-avatar tile>
                <Media :media="getCategoryById(item.id).logoBlack" size="thumbnail" height="30" contain></Media>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list nav>
            <v-list-item v-for="item in aboutMenu.items" :key="item.id" :to="`/${item.slug}`" nuxt class="mb-0">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="item in contactMenu.items" :key="item.id" :to="`/${item.slug}`" nuxt class="mb-0">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="justify-center">
          <div class="d-flex justify-center mb-2">
            <v-btn icon large target="_blank" href="https://www.facebook.com/lachouquette" class="mx-2">
              <v-icon large color="#4267b2">mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon large target="_blank" href="https://www.instagram.com/lachouquette.ch" class="mx-2">
              <v-icon large color="#E1306C">mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon large to="/contact" nuxt class="mx-2">
              <v-icon large color="primary">mdi-email-outline</v-icon>
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar fixed app class="white">
      <div class="cq-md-max-width d-flex align-center" style="width: 100%">
        <template v-if="!toggleSearch">
          <nuxt-link to="/" class="d-flex align-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176.41 41.2" height="40">
              <g id="Calque_7" data-name="Calque 7">
                <path
                  class="cls-1"
                  d="M14.78,30.79H11.61V9.14a1.09,1.09,0,0,0-1.09-1H9.19a1.07,1.07,0,0,0-1.09,1V32.42A1.67,1.67,0,0,0,9.86,34h4.92a1,1,0,0,0,1.09-1V31.81A1.07,1.07,0,0,0,14.78,30.79Z"
                />
                <path
                  class="cls-1"
                  d="M25,8.12a5,5,0,0,0-5.26,4.79V33a1.06,1.06,0,0,0,1.08,1h1.34a1,1,0,0,0,1.08-1V22.69h3.47V33a1,1,0,0,0,1.08,1h1.34a1,1,0,0,0,1.09-1V12.91A5,5,0,0,0,25,8.12Zm-1.76,4.79a1.75,1.75,0,0,1,3.47,0v6.52H23.25Z"
                />
                <path
                  class="cls-1"
                  d="M48.68,8.72A5.77,5.77,0,0,0,46,8h-.06a6.46,6.46,0,0,0-.78.07A5.37,5.37,0,0,0,44,8.42a5.19,5.19,0,0,0-2.36,1.83,4.43,4.43,0,0,0-.82,2.56V29.27A4.62,4.62,0,0,0,42.7,33a5.42,5.42,0,0,0,2.1.94A5.88,5.88,0,0,0,46,34a6.08,6.08,0,0,0,.61,0,5.65,5.65,0,0,0,2.24-.74,5.21,5.21,0,0,0,1.54-1.41,4.48,4.48,0,0,0,.85-2.59v-1.4a1,1,0,0,0-1.09-1H48.81l-.24,0a1,1,0,0,0-.85,1v1.4a1.32,1.32,0,0,1-.2.68,1.73,1.73,0,0,1-1.52.83,1.77,1.77,0,0,1-.73-.15,1.5,1.5,0,0,1-1-1.36V12.81a1.49,1.49,0,0,1,.87-1.31,1.83,1.83,0,0,1,.78-.19H46a1.88,1.88,0,0,1,.92.24,1.48,1.48,0,0,1,.8,1.27V14.1a1,1,0,0,0,1,1h1.47a1,1,0,0,0,1.09-1V12.81A4.69,4.69,0,0,0,48.68,8.72Z"
                />
                <path
                  class="cls-1"
                  d="M63.67,8h-1.3a1.07,1.07,0,0,0-1.09,1V19.43H57.81V9.06a1.07,1.07,0,0,0-1.09-1H55.38A1.08,1.08,0,0,0,54.29,9.1V33a1,1,0,0,0,1.09,1h1.34a1,1,0,0,0,1.09-1V22.69h3.47V33a1,1,0,0,0,1.09,1h1.3a1,1,0,0,0,1.08-1v-24A1.06,1.06,0,0,0,63.67,8Z"
                />
                <path
                  class="cls-1"
                  d="M74.34,8a5.07,5.07,0,0,0-5.28,4.81V29.27a5.28,5.28,0,0,0,10.51,0V12.85A5,5,0,0,0,74.34,8Zm1.71,21.23a1.62,1.62,0,0,1-1.71,1.51,1.65,1.65,0,0,1-1.76-1.51V12.85a1.75,1.75,0,0,1,3.47,0Z"
                />
                <path
                  class="cls-1"
                  d="M93.3,8H92a1.07,1.07,0,0,0-1.09,1V29.27a1.63,1.63,0,0,1-1.72,1.51,1.65,1.65,0,0,1-1.75-1.51V9.06a1.07,1.07,0,0,0-1.09-1H85a1.1,1.1,0,0,0-1.09,1V29.27a5.28,5.28,0,0,0,10.51,0V9.06A1.07,1.07,0,0,0,93.3,8Z"
                />
                <path
                  class="cls-1"
                  d="M122.09,8h-1.33a1.07,1.07,0,0,0-1.09,1V29.27A1.63,1.63,0,0,1,118,30.78a1.65,1.65,0,0,1-1.76-1.51V9.06a1.07,1.07,0,0,0-1.09-1h-1.34a1.1,1.1,0,0,0-1.08,1V29.27a5.27,5.27,0,0,0,10.5,0V9.06A1.07,1.07,0,0,0,122.09,8Z"
                />
                <path
                  class="cls-1"
                  d="M133.4,8h-5a1.69,1.69,0,0,0-1.75,1.63V32.41A1.67,1.67,0,0,0,128.41,34h5a1,1,0,0,0,1.09-1V31.81a1.07,1.07,0,0,0-1.09-1h-3.23V22.69h3.23a1.07,1.07,0,0,0,1.09-1V20.45a1,1,0,0,0-1.09-1h-3.23V11.3h3.23a1,1,0,0,0,1.09-1V9.06A1.07,1.07,0,0,0,133.4,8Z"
                />
                <path
                  class="cls-1"
                  d="M145.07,8h-6.44a1.07,1.07,0,0,0-1.09,1v1.22a1,1,0,0,0,1.09,1h1.46V33a1,1,0,0,0,1.09,1h1.34a1,1,0,0,0,1.09-1V11.3h1.46a1,1,0,0,0,1.09-1V9.06A1.07,1.07,0,0,0,145.07,8Z"
                />
                <path
                  class="cls-1"
                  d="M156.33,8h-6.44a1.07,1.07,0,0,0-1.09,1v1.22a1,1,0,0,0,1.09,1h1.46V33a1,1,0,0,0,1.09,1h1.34a1,1,0,0,0,1.09-1V11.3h1.46a1,1,0,0,0,1.09-1V9.06A1.07,1.07,0,0,0,156.33,8Z"
                />
                <path
                  class="cls-1"
                  d="M167.76,8.19a1.13,1.13,0,0,0-.55-.15h-5a2,2,0,0,0-.42.05,1.75,1.75,0,0,0-1.21,1,1.54,1.54,0,0,0-.13.6V32.41a1.6,1.6,0,0,0,.78,1.36,1.87,1.87,0,0,0,1,.27h5a1,1,0,0,0,1.09-1V31.81a1.07,1.07,0,0,0-1.09-1H164V22.69h3.22a1.11,1.11,0,0,0,.95-.53,1,1,0,0,0,.14-.49V20.45a1,1,0,0,0-1.09-1H164V11.3h3.22a1.16,1.16,0,0,0,.54-.13,1,1,0,0,0,.55-.89V9.06A1,1,0,0,0,167.76,8.19Z"
                />
                <path
                  class="cls-1"
                  d="M103.93,8.12a5,5,0,0,0-5.23,4.77V29.27a4.85,4.85,0,0,0,3.47,4.48v6.39h3.51V33.75a4.86,4.86,0,0,0,3.48-4.48V12.89A5,5,0,0,0,103.93,8.12Zm1.71,21.15a1.73,1.73,0,0,1-3.43,0V12.89a1.72,1.72,0,0,1,3.43,0Z"
                />
                <g id="Tracé_2410" data-name="Tracé 2410">
                  <path class="cls-1" d="M176.41,41.2H0V0H176.41ZM2.13,39.07H174.28V2.13H2.13Z" />
                </g>
              </g>
            </svg>
          </nuxt-link>

          <v-spacer></v-spacer>

          <v-btn icon class="primary--text" small @click="toggleSearch = true">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>

          <v-app-bar-nav-icon class="primary--text" @click="toggleMenu = !toggleMenu"></v-app-bar-nav-icon>
        </template>
        <transition name="fade">
          <v-text-field
            v-if="toggleSearch"
            v-model="searchText"
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
            @change="search"
            @click:prepend="toggleSearch = false"
          ></v-text-field>
        </transition>
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="pa-0 min-vh-100 d-flex flex-column">
        <nuxt></nuxt>
      </v-container>

      <Footer class="mt-auto"></Footer>
    </v-main>

    <v-bottom-navigation v-if="$vuetify.breakpoint.mobile" v-model="selectedNav" fixed app color="cq-red">
      <v-btn nuxt to="/" class="black--text" active-class="cq-yellow">
        <span>Accueil</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn nuxt to="/fiches" class="black--text" active-class="cq-yellow">
        <span>Adresses</span>
        <v-icon>mdi-map-marker-multiple-outline</v-icon>
      </v-btn>

      <v-btn nuxt to="/articles" class="black--text" active-class="cq-yellow">
        <span>Articles</span>
        <v-icon>mdi-newspaper-variant-multiple</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <client-only>
      <cookie-consent v-if="showCookieConsent" aria-label="Cookie Preferences" aria-live="polite">
        <template slot="message">
          <span class="white--text mx-3">
            Ici, on aime les Cookies <v-icon color="white">mdi-cookie</v-icon>, mais pas plus qu'il n'en faut !
            <nuxt-link to="/politique-de-confidentialite" class="white--text">En savoir +</nuxt-link>
          </span>
        </template>
        <template slot="button">
          <v-btn class="my-2" color="cq-blue">J'accepte<v-icon right>mdi-thumb-up-outline</v-icon></v-btn>
        </template>
      </cookie-consent>
    </client-only>
  </v-app>
</template>

<script>
import CookieConsent from 'vue-cookieconsent-component'
import isbot from 'isbot'
import { mapGetters, mapState } from 'vuex'
import Footer from '~/components/Footer'
import LayoutAlert from '~/components/LayoutAlert'
import Media from '~/components/Media'

export default {
  components: { LayoutAlert, Footer, CookieConsent, Media },
  async middleware({ store }) {
    await store.dispatch('nuxtServerInit')
  },
  data() {
    return {
      showCookieConsent: false,

      toggleMenu: false,
      toggleSearch: false,
      searchText: null,

      selectedNav: undefined,
    }
  },
  methods: {
    search() {
      const searchText = this.searchText
      this.toggleSearch = false
      this.searchText = null
      this.$router.push(`/search/${searchText}`)
    },
  },
  computed: {
    ...mapGetters('menus', {
      aboutMenu: 'getAboutMenu',
      categoryMenu: 'getCategoryMenu',
      contactMenu: 'getContactMenu',
    }),
    ...mapGetters('categories', {
      getCategoryById: 'getById',
    }),
    displayDrawer() {
      return this.$vuetify.breakpoint.mobile && this.toggleMenu
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

.theme--light.v-list-item--active:hover::before,
.theme--light.v-list-item--active::before {
  opacity: 0;
}

.v-app-bar-title__content {
  display: flex;
  align-content: center;
}

.v-list-item--link {
  background-color: transparent !important;
}

svg {
  fill: var(--v-primary-base);
}

svg {
  @include hover-focus-active {
    fill: var(--v-cq-yellow-base);
  }
}

.v-bottom-navigation > .v-btn {
  @include hover-focus-active {
    background-color: var(--v-cq-yellow-base) !important;
  }

  &::before {
    opacity: 0 !important;
  }
}
</style>
