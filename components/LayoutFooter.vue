<template>
  <footer class="footer container-fluid text-center">
    <div class="footer-top row pt-4">
      <div class="col">
        <nuxt-link to="/" title="Page d'accueil">
          <img
            class="mx-auto"
            :src="`${wordpressUrl}/wp-content/uploads/2019/03/logo_white-300x276.png`"
            alt="Logo Chouquette"
          />
        </nuxt-link>
        <div class="my-3">
          <div>
            <ul class="footer-top-menu px-2">
              <li v-for="page in pages" :key="page.object_id">
                <nuxt-link :to="{ path: `/${page.slug}` }">{{ page.title }}</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom row py-3">
      <div class="col">
        <span
          >Copyright 2014-{{ currentYear }} - Tous droits réservés à La Chouquette. Toutes les images et le contenu sont
          la propriété du site.</span
        >
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState('menus', {
      pages: 'footerPages',
    }),
    ...mapState(['wordpressUrl']),
    currentYear() {
      return moment().format('YYYY')
    },
  },
}
</script>

<style lang="scss" scoped>
.footer {
  color: $white;
  z-index: $zindex-fixed;
  position: relative;
  display: inline-block;
}

.footer-top {
  background-color: $chouquette-dark-grey;
}

ul.footer-top-menu {
  list-style-type: none;
  padding: 0;

  li {
    display: inline-block;
    margin: 8px 0;
  }

  li + li {
    margin-left: 0.5rem;
  }

  a {
    color: $white;
  }
}

.footer-bottom {
  background-color: $chouquette-darker-grey;
}

.footer-confidentiality {
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: $chouquette-dark-grey;
  z-index: $zindex-popover;

  > div {
    min-height: 10vh;

    @include media-breakpoint-down(sm) {
      min-height: 25vh;
    }
  }

  span {
    font-size: $font-size-lg;
    color: $white;
  }
}
</style>
