<template>
  <div v-if="fiche" class="fiche-page layout-content container-fluid mx-auto">
    <h1 class="text-center my-4">{{ escapedTitle }}</h1>
    <main role="main">
      <article class="fiche fiche-flip fiche-chouquettise">
        <div class="fiche-container d-flex justify-content-center">
          <div class="fiche-front mx-md-5">
            <div class="card">
              <div class="card-header p-0">
                <WpMedia
                  :media="featuredMedia"
                  size="medium_large"
                  :no-src-set="true"
                  class="fiche-image"
                />
                <span
                  class="fiche-category-icon rounded-circle"
                  :class="fiche.info.chouquettise ? 'bg-yellow' : 'bg-white'"
                >
                  <img
                    src="http://chouquette.test/wp-content/uploads/2019/06/sur-le-pouce_black-e1561470507805-150x150.png"
                    alt=""
                    title="Sur le pouce"
                    width="35"
                    height="35"
                  />
                </span>
              </div>
              <div class="card-body d-flex flex-column position-relative">
                <h2 class="card-title text-center h4">{{ escapedTitle }}</h2>
                <p class="card-text" v-html="fiche.content.rendered" />
                <div v-if="fiche.info.chouquettise" class="card-text d-flex justify-content-around mt-auto">
                  <a
                    :href="`tel: ${fiche.info.telephone}`"
                    :title="fiche.info.telephone"
                    target="_blank"
                    class="fiche-social border border-secondary rounded-circle"
                    ><i class="fas fa-phone"></i
                  ></a>
                  <a
                    href="#"
                    title="Envoyer un message"
                    data-toggle="modal"
                    data-target="#ficheContactModal"
                    data-fiche-title="Maison Buet – Succursale Haldimand"
                    data-fiche-id="18647"
                    class="fiche-social border border-secondary rounded-circle"
                    ><i class="far fa-envelope"></i
                  ></a>
                  <a
                    :href="fiche.info.sn_facebook"
                    title="Facebook"
                    target="_blank"
                    class="fiche-social border border-secondary rounded-circle"
                    ><i class="fab fa-facebook-f"></i
                  ></a>
                  <a
                    :href="fiche.info.sn_instagram"
                    title="Instagram"
                    target="_blank"
                    class="fiche-social border border-secondary rounded-circle"
                    ><i class="fab fa-instagram"></i
                  ></a>
                </div>
                <a
                  title="Reporter une précision ou erreur sur la fiche"
                  href="#"
                  data-toggle="modal"
                  data-target="#ficheReportModal"
                  data-fiche-title="Maison Buet – Succursale Haldimand"
                  data-fiche-id="18647"
                  class="fiche-report"
                  ><i class="fas fa-exclamation-circle"></i
                ></a>
              </div>
              <div class="card-footer">
                <a
                  href="http://chouquette.test/maison-buet-boulangerie-patisserie-chocolaterie-traiteur-tea-room-brunch-lausanne/"
                  title="Dernier article sur le lieu"
                  class="btn btn-outline-secondary"
                  ><i class="far fa-newspaper"></i
                ></a>
                <a
                  href=""
                  title="Plus de détails (retourner la fiche)"
                  class="d-md-none btn btn-secondary float-right"
                  @click.prevent="ficheFlip($event.target)"
                  ><i class="fas fa-plus"></i
                ></a>
              </div>
            </div>
          </div>
          <div class="fiche-back mx-md-5">
            <div class="card" style="height: 580px;">
              <div class="card-header"></div>
              <div class="card-body position-relative p-0">
                <ul v-if="fiche.info.chouquettise" class="list-group list-group-flush">
                  <li class="list-group-item">
                    <a
                      :href="`tel: ${fiche.info.telephone}`"
                      title="Téléphone"
                      target="_blank"
                      class="text-decoration-none"
                      ><i class="fas fa-phone"></i>{{ fiche.info.telephone }}
                    </a>
                  </li>
                  <li class="list-group-item">
                    <a :href="fiche.info.website" title="Site Internet" target="_blank" class="text-decoration-none"
                      ><i class="fas fa-globe"></i>{{ fiche.info.website }}
                    </a>
                  </li>
                  <li class="list-group-item">
                    <a
                      :href="`mailto:${fiche.info.mail}?body=%0A---%0AEnvoy%C3%A9%20depuis%20${currentURL}`"
                      title="Email"
                      target="_blank"
                      class="text-decoration-none"
                      ><i class="fas fa-at"></i>{{ fiche.info.mail }}
                    </a>
                  </li>
                  <li class="list-group-item">
                    <label class="mb-0">Prix :</label>
                    <span class="fiche-price fiche-price-selected">{{ fichePrice[0] }}</span
                    ><span class="fiche-price">{{ fichePrice[1] }}</span>
                  </li>
                  <li class="list-group-item">
                    <label class="mb-0">Horaires :</label>
                    <div class="fiche-planning dropup d-inline-block">
                      <a
                        :id="`planning${_uid}`"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        class="link-secondary link-no-decoration dropdown-toggle"
                        >{{ getOpening() }} ({{ currentDayOfWeek }})</a
                      >
                      <div :aria-labelledby="`planning${_uid}`" class="dropdown-menu">
                        <ul>
                          <li><label class="mb-0">Lundi</label>{{ getOpening(1) }}</li>
                          <li><label class="mb-0">Mardi</label>{{ getOpening(2) }}</li>
                          <li><label class="mb-0">Mercredi</label>{{ getOpening(3) }}</li>
                          <li><label class="mb-0">Jeudi</label>{{ getOpening(4) }}</li>
                          <li><label class="mb-0">Vendredi</label>{{ getOpening(5) }}</li>
                          <li><label class="mb-0">Samedi</label>{{ getOpening(6) }}</li>
                          <li><label class="mb-0">Dimanche</label>{{ getOpening(0) }}</li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="card-text p-3">
                  <span>Plats à emporter, Service de livraison</span>
                </div>
                <a
                  href="#"
                  title="Reporter une précision ou erreur sur la fiche"
                  data-toggle="modal"
                  data-target="#ficheReportModal"
                  data-fiche-title="Maison Buet – Succursale Haldimand"
                  data-fiche-id="18647"
                  class="fiche-report"
                  ><i class="fas fa-exclamation-circle"></i
                ></a>
              </div>
              <div class="card-footer">
                <a
                  href="http://chouquette.test/maison-buet-boulangerie-patisserie-chocolaterie-traiteur-tea-room-brunch-lausanne/"
                  title="Dernier article sur le lieu"
                  class="btn btn-outline-secondary"
                  ><i class="far fa-newspaper"></i
                ></a>
                <a
                  href=""
                  title="Plus de détails (retourner la fiche)"
                  class="d-md-none btn btn-secondary float-right"
                  @click.prevent="ficheFlip($event.target)"
                  ><i class="fas fa-plus"></i
                ></a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>

<script>
import he from 'he'
import $ from 'jquery'
import moment from 'moment'

import FicheAPI from '../../api/wordpress/fiches'
import WpMedia from '../../components/WpMedia'

export default {
  components: { WpMedia },
  data() {
    return {
      fiche: null,
      featuredMedia: null
    }
  },
  computed: {
    escapedTitle() {
      return he.decode(this.fiche.title.rendered)
    },
    currentURL() {
      return window.location.host
    },
    fichePrice() {
      return ['$'.repeat(this.fiche.info.cost), '$'.repeat(5 - this.fiche.info.cost)]
    },
    currentDayOfWeek() {
      return moment()
        .locale('fr-CH')
        .format('dddd')
    }
  },
  async created() {
    this.fiche = await FicheAPI.getBySlug(this.$route.params.slug)
    this.featuredMedia = this.fiche._embedded['wp:featuredmedia'][0]
  },
  mounted() {
    // enable dropdown menu
    require('bootstrap/js/dist/dropdown')
    this.fichePlanningDropdown = $(this.$el)
      .find('.fiche-planning')
      .first()

    // handle fiche heights
    $(this.$el)
      .find('.fiche')
      .each((index, element) => {
        // compute each fiche height
        const frontHeight = $(element)
          .find('.fiche-front .card')
          .height()
        const backHeight = $(element)
          .find('.fiche-back .card')
          .height()

        if (frontHeight > backHeight) {
          $(element).height(frontHeight)
          $(element)
            .find('.fiche-back .card')
            .height(frontHeight)
        } else {
          $(element).height(backHeight)
          $(element)
            .find('.fiche-front .card')
            .height(backHeight)
        }

        // add mouse gesture
        const Hammer = require('hammerjs')
        const mc = new Hammer(element)
        mc.on('swipeleft swiperight', () => this.ficheFlip(element))
      })
  },
  methods: {
    ficheFlip(element) {
      const fiche = $(element).hasClass('fiche') ? $(element) : $(element).parents('.fiche')

      // flip card
      if (!fiche.hasClass('flipped')) {
        fiche.find('.fiche-back').css('transform', 'rotateY(0deg)')
        fiche.find('.fiche-front').css('transform', 'rotateY(180deg)')
      } else {
        // hide dropdown
        this.fichePlanningDropdown.dropdown('hide')
        fiche.find('.fiche-back').css('transform', 'rotateY(180deg)')
        fiche.find('.fiche-front').css('transform', 'rotateY(0deg)')
      }
      fiche.toggleClass('flipped')
    },
    getOpening(dayOfWeek = new Date().getDay()) {
      const opening = this.fiche.info.openings[dayOfWeek]
      return opening.includes('closed') ? 'Fermé' : opening
    }
  }
}
</script>

<style lang="scss" scoped>
.fiche-page {
  h1 {
    font-family: $font-family-heading;
  }
}

.fiche.highlight {
  @include media-breakpoint-up(md) {
    .card {
      box-shadow: $box-shadow-lg !important;
    }
  }
}

// down sm : fiche front/back are folded
@include media-breakpoint-down(sm) {
  .fiche-flip {
    background-color: transparent;
    perspective: 1000px; /* Remove this if you don't want the 3D effect */

    /* This container is needed to position the front and back side */
    .fiche-container {
      position: relative;
      width: 100%;

      /* Position the front and back side */
      .fiche-front,
      .fiche-back {
        position: absolute;
        width: 100%;
        backface-visibility: hidden;

        transition: transform 0.6s;
        transform-style: preserve-3d;
      }

      .fiche-back {
        transform: rotateY(180deg);
      }
    }
  }
}

.fiche-front,
.fiche-back {
  width: 300px;
  max-width: 100%;

  @include media-breakpoint-down(sm) {
    width: 100%;
  }

  .card-footer {
    height: 64px;
  }
}

.fiche-image {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;

  object-fit: cover;
}

.fiche-category-icon {
  padding: 0.75rem;

  position: absolute;
  top: 5px;
  left: 5px;
}

.card-header {
  height: 200px;
  max-height: 25vh;
}
.fiche-front .card-header {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-title {
  font-family: $font-family-heading;
}

.card-text {
  a {
    color: $secondary;
  }
}

.fiche-social {
  display: inline-block;
  width: 35px;
  height: 35px;

  text-align: center;
  vertical-align: middle;
  line-height: 35px;

  color: $black;

  @include hover-focus-active {
    background-color: $chouquette-yellow;
  }
}

.fiche-price:not(.fiche-price-selected) {
  color: $chouquette-light-grey;
}

.fiche-planning {
  > a {
    white-space: normal !important;
  }

  .dropdown-menu {
    left: -5rem !important;

    ul {
      list-style-type: none;
      padding: 0 0.75rem;
    }

    li {
      > label {
        width: 7rem;
      }
      white-space: nowrap;
    }
  }
}

.fiche-report {
  position: absolute;
  top: 7px;
  right: 7px;

  font-size: $font-size-base;

  > i {
    color: $chouquette-grey;
  }
}
.fiche-front .fiche-report {
  top: 5px;
}
.fiche-back .fiche-report {
  bottom: 5px;
}
</style>
