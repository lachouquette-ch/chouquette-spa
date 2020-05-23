<template>
  <div>
    <LayoutAlert />
    <LayoutHeaderCovid>
      Page spéciale COVID-19
    </LayoutHeaderCovid>
    <LayoutHeader />
    <nuxt />
    <LayoutFooter />
    <cookie-consent>
      <template slot="message">
        <span class="text-white">
          Ici, on aime les Cookies <i class="fas fa-cookie-bite"></i>, mais pas plus qu'il n'en faut !
          <nuxt-link to="/politique-de-confidentialite" class="btn btn-outline-yellow mx-2">En savoir plus</nuxt-link>
        </span>
      </template>
      <template slot="button">
        <button class="btn btn-yellow mx-2">J'accepte</button>
      </template>
    </cookie-consent>
  </div>
</template>

<script>
import CookieConsent from 'vue-cookieconsent-component'
import LayoutHeaderCovid from '../components/LayoutHeaderCovid'
import LayoutHeader from '../components/LayoutHeader'
import LayoutFooter from '../components/LayoutFooter'
import LayoutAlert from '../components/LayoutAlert'

export default {
  components: { LayoutAlert, LayoutHeader, LayoutFooter, LayoutHeaderCovid, CookieConsent },
  middleware({ store }) {
    if (process.client) {
      store.dispatch('nuxtServerInit')
    }
  }
}
</script>

<style scoped></style>
