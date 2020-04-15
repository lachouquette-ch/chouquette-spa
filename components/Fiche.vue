<template>
  <article ref="fiche" class="fiche fiche-flip fiche-chouquettise">
    <div class="fiche-container d-flex justify-content-center">
      <div ref="ficheFront" class="fiche-front mx-md-5">
        <div ref="front" class="card">
          <div class="card-header p-0">
            <WpMedia v-if="featuredMedia" :media="featuredMedia" size="medium_large" :no-src-set="true" class="fiche-image" />
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
            <h2 class="card-title text-center h4">{{ fiche.title.rendered | heDecode }}</h2>
            <p class="card-text" v-html="fiche.content.rendered" />
            <div v-if="fiche.info.chouquettise" class="card-text d-flex justify-content-around mt-auto">
              <a
                v-if="fiche.info.telephone"
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
                v-if="fiche.info.sn_facebook"
                :href="fiche.info.sn_facebook"
                title="Facebook"
                target="_blank"
                class="fiche-social border border-secondary rounded-circle"
                ><i class="fab fa-facebook-f"></i
              ></a>
              <a
                v-if="fiche.info.sn_instagram"
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
      <div v-if="criteria" ref="ficheBack" class="fiche-back mx-md-5">
        <div ref="back" class="card">
          <div class="card-header"></div>
          <div class="card-body position-relative p-0">
            <ul v-if="fiche.info.chouquettise" class="list-group list-group-flush">
              <li class="list-group-item">
                <a
                  v-if="fiche.info.telephone"
                  :href="`tel: ${fiche.info.telephone}`"
                  title="Téléphone"
                  target="_blank"
                  class="text-decoration-none"
                  ><i class="fas fa-phone"></i> {{ fiche.info.telephone }}
                </a>
              </li>
              <li class="list-group-item">
                <a
                  v-if="fiche.info.website"
                  :href="fiche.info.website"
                  title="Site Internet"
                  target="_blank"
                  class="text-decoration-none"
                  ><i class="fas fa-globe"></i> {{ fiche.info.website }}
                </a>
              </li>
              <li class="list-group-item">
                <a
                  v-if="fiche.info.mail"
                  :href="`mailto:${fiche.info.mail}?body=%0A---%0AEnvoy%C3%A9%20depuis%20${currentURL}`"
                  title="Email"
                  target="_blank"
                  class="text-decoration-none"
                  ><i class="fas fa-at"></i> {{ fiche.info.mail }}
                </a>
              </li>
              <li v-if="fiche.info.cost" class="list-group-item">
                <label class="mb-0">Prix :</label>
                <span class="fiche-price fiche-price-selected">{{ fichePrice[0] }}</span
                ><span class="fiche-price">{{ fichePrice[1] }}</span>
              </li>
              <li v-if="fiche.info.openings" class="list-group-item">
                <label class="mb-0">Horaires :</label>
                <b-dropdown
                  id="dropdown-1"
                  class="fiche-planning"
                  variant="link"
                  toggle-tag="span"
                  toggle-class="text-decoration-none d-inline-block p-0 border-0"
                  dropup
                  right
                >
                  <template v-slot:button-content> {{ getOpening() }} ({{ currentDayOfWeek }}) </template>
                  <template v-slot:default>
                    <b-dropdown-text><label class="mb-0">Lundi</label>{{ getOpening(1) }}</b-dropdown-text>
                    <b-dropdown-text><label class="mb-0">Mardi</label>{{ getOpening(2) }}</b-dropdown-text>
                    <b-dropdown-text><label class="mb-0">Mercredi</label>{{ getOpening(3) }}</b-dropdown-text>
                    <b-dropdown-text><label class="mb-0">Jeudi</label>{{ getOpening(4) }}</b-dropdown-text>
                    <b-dropdown-text><label class="mb-0">Vendredi</label>{{ getOpening(5) }}</b-dropdown-text>
                    <b-dropdown-text><label class="mb-0">Samedi</label>{{ getOpening(6) }}</b-dropdown-text>
                    <b-dropdown-text><label class="mb-0">Dimanche</label>{{ getOpening(0) }}</b-dropdown-text>
                  </template>
                </b-dropdown>
              </li>
            </ul>
            <div class="card-text p-3">
              <span v-if="criteria">{{ criteriaList }}</span>
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
</template>

<script>
import $ from 'jquery'
import moment from 'moment'

import WpMedia from './WpMedia'

export default {
  components: { WpMedia },
  props: {
    fiche: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      featuredMedia: null,
      criteria: null
    }
  },
  computed: {
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
    },
    criteriaList() {
      const allCriteria = this.criteria.flatMap(({ values }) => values)
      return allCriteria.map(({ name }) => name).join(', ')
    }
  },
  async mounted() {
    // set initial fiche height
    $(this.$refs.fiche).height($(this.$refs.front).height())

    this.featuredMedia = this.fiche._embedded['wp:featuredmedia'][0]
    this.criteria = await this.$wpAPI.criteria.getForFiche(this.fiche.id)
    this.$nextTick(() => this.resizeFiche()) // needs time to display fiche before computing its size
  },
  methods: {
    resizeFiche() {
      const frontElement = $(this.$refs.front)
      const backElement = $(this.$refs.back)

      if (frontElement.height() > backElement.height()) {
        backElement.height(frontElement.height())
        $(this.$refs.fiche).height(frontElement.height())
      } else {
        frontElement.height(backElement.height())
        $(this.$refs.fiche).height(backElement.height())
      }

      // add mouse gesture
      const Hammer = require('hammerjs')
      const mc = new Hammer(this.$el)
      mc.on('swipeleft swiperight', () => this.ficheFlip(this.$el))
    },
    ficheFlip(element) {
      const fiche = $(this.$refs.fiche)

      // flip card
      if (!fiche.hasClass('flipped')) {
        $(this.$refs.ficheBack).css('transform', 'rotateY(0deg)')
        $(this.$refs.ficheFront).css('transform', 'rotateY(180deg)')
      } else {
        $(this.$refs.ficheBack).css('transform', 'rotateY(180deg)')
        $(this.$refs.ficheFront).css('transform', 'rotateY(0deg)')
      }
      fiche.toggleClass('flipped')
    },
    getOpening(dayOfWeek = new Date().getDay()) {
      const opening = this.fiche.info.openings[dayOfWeek]
      return opening.includes('closed') ? 'fermé' : opening
    }
  }
}
</script>

<style lang="scss" scoped>
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
  label {
    width: 6rem;
  }

  .b-dropdown-text {
    white-space: nowrap;
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
