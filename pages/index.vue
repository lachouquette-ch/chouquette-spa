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
              <div class="home-header-category-logo p-3 rounded-circle">
                <CategoryLogo :category="category" height="60" width="60" color="yellow" />
              </div>
              <h2 class="my-2">{{ category.name }}</h2>
            </nuxt-link>
          </div>
        </div>
        <Search class="home-header-filters" button-class="home-header-filters-button" />
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
        <div v-if="latestPosts" class="post-card-shuffler d-flex flex-wrap align-items-center justify-content-center">
          <nuxt-link
            v-for="post in latestPosts"
            :key="post.id"
            :to="{ path: `/${post.slug}` }"
            class="post-card text-decoration-none"
          >
            <PostCard :post="post" class="mx-auto" />
          </nuxt-link>
        </div>
        <div v-else class="text-center"><b-spinner variant="yellow" label="Spinning"></b-spinner></div>
      </div>

      <div class="my-5">
        <a class="home-newsletter-target" name="newsletter"></a>
        <Newsletter />
      </div>

      <div class="home-tops container">
        <div class="text-center">
          <h2 class="mb-4">Nos derniers tops...</h2>
        </div>
        <div v-if="topPosts" v-swiper="swiperOptions" class="swiper px-md-5">
          <div class="swiper-wrapper pt-3 pt-md-0">
            <div v-for="post in topPosts" :key="post.id" class="swiper-slide">
              <nuxt-link :to="{ path: `/${post.slug}` }" class="text-decoration-none">
                <PostCard :post="post" class="mx-auto" />
              </nuxt-link>
            </div>
          </div>
          <div slot="pagination" class="swiper-pagination d-block d-md-none" />
          <div slot="button-prev" class="swiper-button-prev d-none d-md-block"></div>
          <div slot="button-next" class="swiper-button-next d-none d-md-block"></div>
        </div>
        <div v-else class="text-center"><b-spinner variant="yellow" label="Spinning"></b-spinner></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { directive as SwiperDirective } from 'vue-awesome-swiper'
import CategoryLogo from '~/components/CategoryLogo'
import PostCard from '~/components/PostCard'
import Search from '~/components/Search'
import Newsletter from '~/components/Newsletter'

import { AUTO_PLAY, DEFAULT, RESPONSIVE } from '~/constants/swiper'
import yoast from '~/mixins/yoast'

const LATEST_POSTS_NUM = 6
const TOP_POSTS_NUM = 8

export default {
  components: { PostCard, CategoryLogo, Search, Newsletter },
  directives: { swiper: SwiperDirective },
  layout: 'no-header',
  mixins: [yoast],
  data() {
    return {
      latestPosts: null,
      topPosts: null,

      baseURL: process.env.wpBaseUrl,

      swiperOptions: {
        ...DEFAULT,
        ...AUTO_PLAY,
        ...RESPONSIVE
      }
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
    ...mapState('menus', {
      categories: 'headerCategories'
    })
  },
  created() {
    this.$store.dispatch('posts/fetchLatests', LATEST_POSTS_NUM).then((posts) => (this.latestPosts = posts))
    this.$store.dispatch('posts/fetchTops', TOP_POSTS_NUM).then((posts) => (this.topPosts = posts))
  },
  async asyncData({ app, store }) {
    const yoast = await app.$wpAPI.yoast.getHome().then(({ data }) => data)

    return {
      yoast
    }
  },
  head() {
    return {
      title: this.yoast.yoast_title,
      meta: this.yoastMetaConfig(this.yoast.yoast_meta),
      script: this.yoastJsonLDConfig(this.yoast.yoast_json_ld)
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

::v-deep .home-header-filters-button {
  @include media-breakpoint-down(sm) {
    width: 100%;
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

.home-newsletter-target {
  display: block;
  position: relative;
  visibility: hidden;

  top: -1 * $covid-banner-height - 15px;
}

.home-tops {
  // do not display category for tops
  .article-card-category {
    display: none;
  }
}
</style>
