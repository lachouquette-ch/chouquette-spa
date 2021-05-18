<template>
  <div>
    <LayoutAlert />
    <nuxt />
    <LayoutFooter />
    <client-only>
      <cookie-consent aria-label="Cookie Preferences" aria-live="polite">
        <template slot="message">
          <span class="text-white mx-3">
            Ici, on aime les Cookies <i class="fas fa-cookie-bite"></i>, mais pas plus qu'il n'en faut !
            <nuxt-link to="/politique-de-confidentialite" class="text-yellow">En savoir plus</nuxt-link>
          </span>
        </template>
        <template slot="button">
          <button class="btn btn-yellow px-3 mt-2 mt-md-0">J'accepte</button>
        </template>
      </cookie-consent>
    </client-only>
  </div>
</template>

<script>
import CookieConsent from 'vue-cookieconsent-component'
import LayoutFooter from '../components/LayoutFooter'
import LayoutAlert from '../components/LayoutAlert'

export default {
  components: { LayoutAlert, LayoutFooter, CookieConsent },
  async middleware({ store }) {
    if (process.client) {
      await store.dispatch('nuxtServerInit')
    }
  },
}
</script>

<style scoped></style>
