<template>
  <div>
    <b-modal
      id="mailchimp-subscribe"
      title="Rejoins notre newsletter"
      hide-footer
      centered
      @shown="focusOn('mailRegistration')"
    >
      <VueMailchimpSubscribe
        url="https://unechouquettealausanne.us8.list-manage.com/subscribe/post-json"
        :user-id="mailChimpUserId"
        :list-id="mailChimpListId"
        @error="onMailchimpSubscriptionError"
        @success="onMailchimpSubscriptionSuccess"
      >
        <template v-slot="{ subscribe, setEmail, loading }">
          <form @submit.prevent="subscribe">
            <div class="input-group">
              <input
                ref="mailRegistration"
                type="email"
                name="email"
                placeholder="Ton email"
                class="required email form-control"
                @input="setEmail($event.target.value)"
              />
              <div class="input-group-append">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span
                    v-show="loading"
                    class="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Je m'inscris
                </button>
              </div>
            </div>
          </form>
        </template>
      </VueMailchimpSubscribe>
    </b-modal>

    <b-modal id="search" title="Tu cherches quelque chose ?" hide-footer centered @shown="focusOn('search')">
      <form @submit.prevent="search(searchText)">
        <div class="input-group">
          <input
            ref="search"
            v-model="searchText"
            class="form-control"
            type="search"
            placeholder="Dis-moi tout..."
            aria-label="Rechercher"
            required
          />
          <div class="input-group-append">
            <button class="btn btn-primary" type="submit"><i class="fas fa-search"></i></button>
          </div>
        </div>
      </form>
    </b-modal>

    <nav class="navbar navbar-chouquette-light navbar-expand-md fixed-top">
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
            <nuxt-link
              :to="{ path: `/category/${category.slug}` }"
              :title="category.description"
              class="nav-link text-center"
            >
              <CategoryLogo :category="category" color="white" class="d-inline nav-logo ml-lg-3 mr-2"></CategoryLogo>
              <span class="text-nowrap">{{ category.name }}</span>
            </nuxt-link>
          </li>
        </ul>
        <div class="dropdown-divider"></div>
        <div class="navbar-sn text-center mr-3">
          <a href="https://www.facebook.com/lachouquettelausanne" title="Facebook" target="_blank"
            ><i class="fab fa-facebook-f"></i
          ></a>
          <a href="https://www.instagram.com/lachouquettelausanne" title="Instagram" target="_blank"
            ><i class="fab fa-instagram ml-3"></i
          ></a>
          <a v-b-modal.mailchimp-subscribe href="" title="Newsletter" @click.prevent
            ><i class="far fa-envelope ml-3"></i
          ></a>
          <a :href="`${baseURL}/feed/atom/`" title="RSS" target="_blank"><i class="fas fa-rss ml-3"></i></a>
          <a v-b-modal.search href="" title="Recherche" class="d-none d-md-inline-block" @click.prevent
            ><i class="fas fa-search ml-3"></i
          ></a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import VueMailchimpSubscribe from 'vue-mailchimp-subscribe/dist/vue-mailchimp-subscribe'
import CategoryLogo from './CategoryLogo'
import modal from '~/mixins/modal'
import newsletter from '~/mixins/newsletter'

export default {
  components: { CategoryLogo, VueMailchimpSubscribe },
  mixins: [modal, newsletter],
  data() {
    return {
      baseURL: process.env.wpBaseUrl,
      categories: [],
      searchText: ''
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
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar-chouquette-light {
  top: $covid-banner-height;
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
</style>
