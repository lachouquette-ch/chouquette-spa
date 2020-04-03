<template>
  <header class="header-menu">
    <AppModal title="Rejoins notre newsletter" :show="showNewsletterModal" @close="closeNewsletterModal">
      <VueMailchimpSubscribe
        url="https://unechouquettealausanne.us8.list-manage.com/subscribe/post-json"
        user-id="570ea90f4cbc136c450fe880a"
        list-id="26f7afd6a2"
        @error="onMailchimpSubscriptionError"
        @success="onMailchimpSubscriptionSuccess"
      >
        <template v-slot="{ subscribe, setEmail }">
          <form @submit.prevent="subscribe">
            <div class="input-group">
              <input
                type="email"
                placeholder="Ton email"
                class="required email form-control"
                autofocus
                @input="setEmail($event.target.value)"
              />
              <div class="input-group-append">
                <button type="submit" class="btn btn-primary">Je m'inscris</button>
              </div>
            </div>
          </form>
        </template>
      </VueMailchimpSubscribe>
    </AppModal>

    <AppModal title="Tu cherches quelque chose ?" :show="showSearchModal" @close="closeSearchModal">
      <form @submit.prevent="search(searchText)">
        <div class="input-group">
          <input
            v-model="searchText"
            class="form-control"
            type="search"
            placeholder="Dis-moi tout..."
            aria-label="Rechercher"
            autofocus
            required
          />
          <div class="input-group-append">
            <button class="btn btn-primary" type="submit"><i class="fas fa-search"></i></button>
          </div>
        </div>
      </form>
    </AppModal>

    <nav class="navbar fixed-top navbar-chouquette-light navbar-expand-md">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarChouquette"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <nuxt-link to="/" class="navbar-brand mx-auto">La Chouquette</nuxt-link>

      <div id="navbarChouquette" class="collapse navbar-collapse">
        <form class="d-md-none mb-2" @submit.prevent="search(searchText)">
          <div class="input-group input-group-sm">
            <input
              v-model="searchText"
              class="form-control"
              type="search"
              placeholder="Recherche"
              aria-label="Rechercher"
              required
            />
            <div class="input-group-append">
              <button class="btn btn-outline-primary" type="submit"><i class="fas fa-search"></i></button>
            </div>
          </div>
        </form>
        <ul v-for="category in categories" :key="category.id" class="navbar-nav mr-auto">
          <li class="nav-item">
            <nuxt-link :to="{ path: `/category/${category.slug}` }" :title="category.description" class="nav-link">
              <CategoryLogo :category="category" color="white" class="nav-logo ml-lg-3 mr-2"></CategoryLogo>
              {{ category.name }}
            </nuxt-link>
          </li>
        </ul>
        <div class="navbar-divider"></div>
        <div class="navbar-sn mr-3">
          <a href="https://www.facebook.com/lachouquettelausanne" title="Facebook" target="_blank"
            ><i class="fab fa-facebook-f"></i
          ></a>
          <a href="https://www.instagram.com/lachouquettelausanne" title="Instagram" target="_blank"
            ><i class="fab fa-instagram ml-3"></i
          ></a>
          <a href="#" title="Newsletter" @click.prevent="openNewsletter"><i class="far fa-envelope ml-3"></i></a>
          <a :href="`${baseURL}/feed/atom/`" title="RSS" target="_blank"><i class="fas fa-rss ml-3"></i></a>
          <a href="#" title="Recherche" class="d-none d-md-inline-block" @click.prevent="openSearchModal"
            ><i class="fas fa-search ml-3"></i
          ></a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import VueMailchimpSubscribe from 'vue-mailchimp-subscribe'
import CategoryLogo from './CategoryLogo'
import AppModal from './AppModal'

export default {
  components: { AppModal, CategoryLogo, VueMailchimpSubscribe },
  data() {
    return {
      baseURL: process.env.wpBaseUrl,
      categories: [],
      searchText: '',
      showNewsletterModal: false,
      showSearchModal: false
    }
  },
  async created() {
    this.categories = await Promise.all(
      this.$store.state.menus.headerCategories.map(({ object_id }) => {
        return this.$store.dispatch('categories/fetchById', object_id)
      })
    )
  },
  methods: {
    search(text) {
      this.$router.push({ path: '/search', query: { s: text } })
    },
    openNewsletter() {
      this.showNewsletterModal = true
    },
    closeNewsletterModal() {
      this.showNewsletterModal = false
    },
    openSearchModal() {
      this.showSearchModal = true
    },
    closeSearchModal() {
      this.showSearchModal = false
    },
    onMailchimpSubscriptionError(errorMessage) {
      this.$store.dispatch('alerts/addAction', { type: 'danger', message: errorMessage })
      this.closeNewsletterModal()
    },
    onMailchimpSubscriptionSuccess() {
      this.$store.dispatch('alerts/addAction', { type: 'success', message: "Tu t'es bien inscris, merci !" })
      this.closeNewsletterModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.header-menu {
  margin-top: calc(#{$header-height} + #{$covid-banner-height}); // corresp. navbar height

  .navbar-chouquette-light {
    top: $covid-banner-height !important;

    background-color: $chouquette-darker-grey;

    .navbar-brand {
      line-height: $header-height;
      font-family: $font-family-brand;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-size: 2.5rem;

      @include media-breakpoint-down(lg) {
        font-size: 2rem;
      }
    }

    .navbar-nav {
      margin: auto;
    }

    .nav-item {
      i {
        font-size: 1.25rem;
      }

      .nav-link-text {
        // hide text since it breaks header display
        @include media-breakpoint-between(md, lg) {
          display: none;
        }
      }
    }

    .navbar-sn {
      font-size: 1.25rem;
    }
  }
}
</style>
