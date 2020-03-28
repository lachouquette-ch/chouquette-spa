<template>
  <div>
    <div class="cq-covid-banner p-3 text-center" role="alert">
      <span class="mr-2">Page spéciale COVID-19</span>
      <a href="<?php echo get_permalink(get_page_by_path( 'covid-19')); ?>" class="btn btn-primary">Clique ici !</a>
    </div>

    <header class="cq-menu">
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
        <a class="navbar-brand mx-auto" href="/">La Chouquette</a>

        <div id="navbarChouquette" class="collapse navbar-collapse">
          <form action="/" class="d-md-none mb-2">
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="search"
                name="s"
                placeholder="Recherche"
                aria-label="Search"
                required=""
              />
              <div class="input-group-append">
                <button class="btn btn-outline-primary" type="submit"><i class="fas fa-search"></i></button>
              </div>
            </div>
          </form>
          <ul class="navbar-nav mr-auto">
            <li class="nav-item ">
              <a class="nav-link" href="https://lachouquette.ch/category/bar-et-restaurant/" title=""
                ><img
                  src="https://lachouquette.ch/wp-content/uploads/2019/04/Bar-et-Restaus_blanc-150x150.png"
                  alt=""
                  title=""
                  class="nav-logo ml-lg-3 mr-2"
                />
                Bars et Restos</a
              >
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="https://lachouquette.ch/category/culture/" title=""
                ><img
                  src="https://lachouquette.ch/wp-content/uploads/2019/04/Culture_blanc-150x150.png"
                  alt=""
                  title=""
                  class="nav-logo ml-lg-3 mr-2"
                />
                Culture</a
              >
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="https://lachouquette.ch/category/loisirs/" title=""
                ><img
                  src="https://lachouquette.ch/wp-content/uploads/2019/04/Loisirs_blanc-150x150.png"
                  alt=""
                  title=""
                  class="nav-logo ml-lg-3 mr-2"
                />
                Loisirs</a
              >
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="https://lachouquette.ch/category/shopping/" title=""
                ><img
                  src="https://lachouquette.ch/wp-content/uploads/2019/04/Shopping_blanc-150x150.png"
                  alt=""
                  title=""
                  class="nav-logo ml-lg-3 mr-2"
                />
                Shopping</a
              >
            </li>
            <li class="nav-item ">
              <a class="nav-link" href="https://lachouquette.ch/category/services/" title=""
                ><img
                  src="https://lachouquette.ch/wp-content/uploads/2019/06/les-services_white-e1561471133258-150x150.png"
                  alt=""
                  title=""
                  class="nav-logo ml-lg-3 mr-2"
                />
                Services</a
              >
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
            <a href="#" title="Newsletter" data-toggle="modal" data-target="#newsletterModal"
              ><i class="far fa-envelope ml-3"></i
            ></a>
            <a href="https://lachouquette.ch/feed/atom/" title="RSS" target="_blank"><i class="fas fa-rss ml-3"></i></a>
            <a
              href="#"
              title="Recherche"
              class="d-none d-md-inline-block"
              data-toggle="modal"
              data-target="#searchModal"
              ><i class="fas fa-search ml-3"></i
            ></a>
          </div>
        </div>
      </nav>
    </header>

    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'title'
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/main';
@import '~assets/css/_navbar';
@import '~assets/css/_fonts';

.cq-covid-banner {
  @extend .fixed-top;
  height: $covid-banner-height;
  background-color: $black;
  color: $chouquette-yellow;
  font-size: $font-size-lg;
  z-index: $zindex-fixed + 2;
}

.covid-newsletter {
  @extend .home-newsletter !optional;
  button {
    width: 10rem;
  }
}

.covid-sn a {
  color: $black;
  width: 10rem;
}

.cq-menu {
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
