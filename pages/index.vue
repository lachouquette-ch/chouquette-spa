<template>
  <div>
    <header class="home-header p-0 container-fluid">
      <nav class="navbar navbar-chouquette">
        <button
          class="navbar-toggler d-inline d-md-none"
          type="button"
          data-toggle="collapse"
          data-target="#navbarChouquette"
          aria-controls="navbarChouquette"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand d-none d-md-inline ml-md-5" href="/">
          <h2 class="home-header-name">{{ wpName }}</h2>
        </a>
        <div class="home-header-sn mr-md-5">
          <a href="https://www.facebook.com/lachouquettelausanne" title="Facebook" target="_blank"
            ><i class="fab fa-facebook-f"></i
          ></a>
          <a href="https://www.instagram.com/lachouquettelausanne" title="Instagram" target="_blank"
            ><i class="fab fa-instagram ml-4"></i
          ></a>
          <a href="#newsletter" title="Newsletter"><i class="far fa-envelope ml-4"></i></a>
          <a :href="`${baseURL}/feed/atom/`" title="RSS" target="_blank"><i class="fas fa-rss ml-4"></i></a>
        </div>

        <div id="navbarChouquette" class="collapse navbar-collapse">
          <ul v-for="category in categories" :key="category.id" class="navbar-nav mr-auto">
            <li class="nav-item">
              <nuxt-link
                :to="{ path: `/category/${category.slug}` }"
                :title="category.description"
                class="nav-link text-md-center"
              >
                <CategoryLogo :category="category" color="white" class="d-inline nav-logo ml-lg-3 mr-2"></CategoryLogo>
                <span class="text-nowrap">{{ category.name }}</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </nav>

      <div class="home-header-menu d-flex flex-column justify-content-md-center align-items-center">
        <div class="text-center w-100">
          <h1 class="home-header-name d-block d-md-none my-2">{{ wpName }}</h1>
          <h3 class="home-header-menu-description mb-3">{{ wpDescription }}</h3>
        </div>
        <div class="d-none d-md-flex flex-row flex-wrap justify-content-center text-center">
          <div v-for="category in categories" :key="category.id" class="home-header-category m-4">
            <nuxt-link
              :to="{ path: `/category/${category.slug}` }"
              :title="category.description"
              class="text-decoration-none"
            >
              <div class="home-header-category-logo p-3 rounded-circle  ">
                <CategoryLogo :category="category" height="60" width="60" color="yellow" />
              </div>
              <h2 class="my-2">{{ category.name }}</h2>
            </nuxt-link>
          </div>
        </div>

        <div class="home-header-filters text-center">
          <form id="app" action="action" @submit.prevent="search">
            <div class="row">
              <div class="col-md-4 home-header-filters-item">
                <select v-model="formSearch.location" class="form-control" title="Où veux-tu aller ?">
                  <option :value="null">Où veux-tu aller ?</option>
                  <option
                    v-for="location in flatLocations"
                    :key="location.id"
                    :value="location"
                    :class="{ 'font-weight-bold': !location.level }"
                  >
                    {{ '&nbsp;'.repeat(location.level * 2) }}{{ location.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4 home-header-filters-item">
                <select v-model="formSearch.category" class="form-control" title="Qu'aimerais-tu faire ?">
                  <option :value="null">Qu'aimerais-tu faire ?</option>
                  <option v-for="category in categories" :key="category.id" :value="category">{{
                    category.name
                  }}</option>
                </select>
              </div>
              <div class="col-md-4 home-header-filters-item">
                <input
                  v-model="formSearch.searchText"
                  class="form-control"
                  type="text"
                  placeholder="Un mot clef ?"
                  name="searchName"
                />
              </div>
            </div>
            <div class="row">
              <div class="col home-header-filters-item">
                <button class="btn btn-primary py-2 px-5" type="submit" :disabled="$v.formSearch.$invalid">
                  Rechercher
                </button>
              </div>
            </div>
          </form>
        </div>
        <div
          class="d-md-none home-header-menu-next d-flex rounded-circle align-items-center justify-content-center text-center"
        >
          <a href="#homeContent" class="text-yellow"> <i class="fas fa-chevron-down"></i><br /> </a>
        </div>
      </div>
    </header>

    <div id="homeContent" class="home-content py-5">
      <div class="home-latest container">
        <div class="text-center">
          <h2 class="mb-4">Nos derniers articles</h2>
        </div>
        <div class="post-card-shuffler d-flex flex-wrap align-items-center justify-content-center">
          <nuxt-link
            v-for="post in latestPosts"
            :key="post.id"
            :to="{ path: `/${post.slug}` }"
            class="post-card text-decoration-none"
          >
            <PostCard :post="post" />
          </nuxt-link>
        </div>
      </div>

      <div class="home-newsletter container-fluid my-5">
        <a class="home-newsletter-target" name="newsletter"></a>
        <div class="row">
          <div class="col-lg-6 m-md-auto mb-3">
            <h2 class="w-75 m-auto text-center">Pour être dans la confidence du meilleur de chez toi</h2>
          </div>
          <div class="col-lg-6">
            <p class="mb-1 h4">Rejoins notre newsletter</p>
            <p class="text-muted">Pour recevoir tous nos bons plans et ne plus rien rater</p>
            <VueMailchimpSubscribe
              url="https://unechouquettealausanne.us8.list-manage.com/subscribe/post-json"
              :user-id="mailChimpUserId"
              :list-id="mailChimpListId"
              @error="onMailchimpSubscriptionError"
              @success="onMailchimpSubscriptionSuccess"
            >
              <template v-slot="{ subscribe, setEmail, loading }">
                <form class="form-inline mx-auto justify-content-center" @submit.prevent="subscribe">
                  <div class="form-row w-100">
                    <div class="col-lg-8 mb-2">
                      <input
                        ref="mailRegistration"
                        type="email"
                        name="email"
                        placeholder="Ton email"
                        class="required email form-control form-control-lg w-100"
                        @input="setEmail($event.target.value)"
                      />
                    </div>
                    <div class="col-lg-4">
                      <button type="submit" name="subscribe" class="btn btn-dark-grey w-100 btn-lg" :disabled="loading">
                        <span
                          v-show="loading"
                          class="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span
                        >Je m'inscris
                      </button>
                    </div>
                  </div>
                </form>
              </template>
            </VueMailchimpSubscribe>
          </div>
        </div>
      </div>

      <div class="home-tops container">
        <div class="text-center">
          <h2 class="mb-4">Nos derniers tops...</h2>
        </div>
        <swiper v-if="topPosts" class="swiper py-3" :options="swiperOption">
          <swiper-slide v-for="post in topPosts" :key="post.id">
            <PostCard :post="post" />
          </swiper-slide>
          <div slot="button-prev" class="swiper-button-prev"></div>
          <div slot="button-next" class="swiper-button-next"></div>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import VueMailchimpSubscribe from 'vue-mailchimp-subscribe/dist/vue-mailchimp-subscribe'

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import CategoryLogo from '~/components/CategoryLogo'
import PostCard from '~/components/PostCard'

import newsletter from '~/mixins/newsletter'

import { AUTO_PLAY_REPONSIVE } from '~/constants/swiper'

const LATEST_POSTS_NUM = 6
const TOP_POSTS_NUM = 8

export default {
  components: { PostCard, CategoryLogo, VueMailchimpSubscribe, Swiper, SwiperSlide },
  mixins: [newsletter],
  layout: 'no-header',
  data() {
    return {
      baseURL: process.env.wpBaseUrl,

      formSearch: {
        category: null,
        location: null,
        searchText: null
      },

      swiperOption: AUTO_PLAY_REPONSIVE
    }
  },
  mounted() {
    // execute anchor fixing
    const linkAnchorFixedHeader = require('~/assets/scripts/link-anchor-fixed-header')
    linkAnchorFixedHeader(70)
  },
  computed: {
    ...mapState({
      wpName: 'name',
      wpDescription: 'description'
    }),
    ...mapState('locations', {
      locations: 'hierarchy'
    }),
    flatLocations() {
      // first level only
      return this.locations.reduce(
        (locations, { location, subLocations }) => [...locations, location, ...subLocations],
        []
      )
    }
  },
  validations: {
    formSearch: {
      oneField() {
        return !!this.formSearch.location || !!this.formSearch.category || !!this.formSearch.searchText
      }
    }
  },
  async asyncData({ app, store }) {
    // get categories
    const categoryIds = store.state.menus.headerCategories.map(({ object_id }) => object_id)

    // fetch all
    const [categories, latestPosts, topPosts] = await Promise.all([
      store.dispatch('categories/fetchByIds', categoryIds),
      store.dispatch('posts/fetchLatests', LATEST_POSTS_NUM),
      store.dispatch('posts/fetchTops', TOP_POSTS_NUM)
    ])

    return {
      categories,
      latestPosts,
      topPosts
    }
  },
  methods: {
    search() {
      if (!this.formSearch.$invalid) {
        const query = this.formSearch.searchText ? { s: this.formSearch.searchText } : {}
        if (this.formSearch.category) {
          if (this.formSearch.location) query.l = this.formSearch.location.slug
          this.$router.push({ path: `/category/${this.formSearch.category.slug}`, query })
        } else if (this.formSearch.location) {
          this.$router.push({ path: `/location/${this.formSearch.location.slug}`, query })
        } else {
          this.$router.push({ path: '/', query })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-header {
  margin-top: 70px;
  height: calc(100vh - 70px);
  min-height: 500px;
  background-image: url('/home.jpg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-color: $chouquette-grey;

  .home-header-name {
    line-height: $header-height;
    font-family: $font-family-brand;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 3rem;
    color: $chouquette-yellow;
    margin: 0;
  }

  h3 {
    font-family: $font-family-heading;
    font-size: $h2-font-size;
    color: #f8ef28;
  }

  .navbar-toggler {
    @include media-breakpoint-up(md) {
      visibility: hidden;
    }
  }
}

.home-header-menu {
  height: 100vh;
  padding-top: 80px; // for menu

  position: relative;
  top: -1 * $header-height;
}

h3.home-header-menu-description {
  @include media-breakpoint-down(sm) {
    font-size: $h4-font-size;
  }

  @media (max-height: 450px) {
    display: none;
  }
}

.home-header-sn {
  font-size: 2rem;

  a {
    color: $chouquette-yellow;
    line-height: $header-height;
  }
}

.home-header-category {
  h2 {
    font-size: $h5-font-size;
    color: $chouquette-yellow;
  }
}

.home-header-category-logo,
.home-header-menu-next {
  background-color: rgba($black, 0.5);
  width: 100px;
  height: 100px;
  margin: auto;

  img {
    max-width: 60px;
  }
}

.home-header-menu-next {
  height: 75px;
  width: 75px;

  font-size: 2rem;
  position: absolute;
  bottom: calc(20px + #{$covid-banner-height});
  right: 0;
  left: 0;
  margin: auto;
}

.home-header-category-icon {
  color: $white;
  font-size: 3rem;
}

.home-header-filters {
  width: 75%;

  @include media-breakpoint-only(xl) {
    width: 50%;
  }
}

.home-header-filters-item {
  padding: 0;
  margin-bottom: 1rem;

  @include media-breakpoint-down(sm) {
    margin-bottom: 0.5rem;
  }

  @include media-breakpoint-up(md) {
    &:not(:last-child) {
      padding-right: 0.5rem !important;
    }
  }

  > button {
    @include media-breakpoint-down(sm) {
      width: 100%;
    }
  }
}

.home-content {
  h2 {
    font-family: $font-family-heading;
    font-size: 2rem;

    @include media-breakpoint-up(lg) {
      font-size: 3rem;
    }
  }
}

.home-newsletter {
  padding: 4rem 3rem;
  background-color: $chouquette-yellow;
  color: black;

  @include media-breakpoint-down(lg) {
    padding: 3rem;
  }

  h2 {
    font-family: $font-family-heading;
    font-size: 1.75rem;
    line-height: 2.5rem;
  }
}

.home-newsletter-target {
  display: block;
  position: relative;
  visibility: hidden;

  top: -1 * $covid-banner-height - 15px;
}

.home-newsletter-response {
  &-error,
  a {
    color: red;
  }

  &-success {
    color: darkgreen;
  }

  a {
    text-decoration: underline;
  }
}

.home-tops {
  // do not display category for tops
  .article-card-category {
    display: none;
  }

  .swiper {
    padding: 1rem 0.5rem;
  }

  .swiper-slide {
    @include hover-focus {
      box-shadow: $box-shadow;
    }

    @include media-breakpoint-down(sm) {
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
