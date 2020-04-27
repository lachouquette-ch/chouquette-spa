<template>
  <div>
    <b-modal ref="ficheModal" title-class="w-100 text-center" hide-footer centered @shown="focusOn('message')">
      <template v-slot:modal-title>{{ fiche.title.rendered | heDecode }}</template>
      <template v-slot:default>
        <form @submit.prevent="postMessage(isContactModal)">
          <label v-if="isContactModal">
            Une question, une demande, une réservation... écris-lui un petit mot directement ici
            <i class="far fa-smile"></i>
          </label>
          <label v-else>
            Une erreur, une remarque, une suggestion sur la fiche ? Merci de nous en faire part
            <i class="far fa-smile"></i>
          </label>
          <div class="form-group">
            <label v-if="isContactModal" for="ficheModalText">Ton message *</label>
            <label v-else for="ficheModalText">Ton commentaire *</label>
            <textarea
              id="ficheModalText"
              ref="message"
              v-model="formFiche.message"
              class="form-control"
              :class="{ 'is-invalid': $v.formFiche.message.$error }"
              rows="8"
              @blur="$v.formFiche.message.$touch"
            ></textarea>
            <div v-if="!$v.formFiche.message.required" class="invalid-feedback">
              Il faut un contenu à ton message
            </div>
            <div v-if="!$v.formFiche.message.minText" class="invalid-feedback">
              Ton message doit avoir un minimum de contenu
            </div>
          </div>
          <div class="form-group">
            <label for="ficheModalName">Ton prénom / nom *</label>
            <input
              id="ficheModalName"
              v-model="formFiche.name"
              name="name"
              class="form-control"
              :class="{ 'is-invalid': $v.formFiche.name.$error }"
              @blur="$v.formFiche.name.$touch"
            />
            <div v-if="!$v.formFiche.name.required" class="invalid-feedback">
              Merci de nous indiquer ton ptit nom
            </div>
          </div>
          <div class="form-group">
            <label for="ficheModalMail">Ton mail *</label>
            <input
              id="ficheModalMail"
              v-model="formFiche.email"
              type="email"
              name="email"
              class="form-control"
              :class="{ 'is-invalid': $v.formFiche.email.$error }"
              @blur="$v.formFiche.email.$touch"
            />
            <div v-if="!$v.formFiche.email.required" class="invalid-feedback">
              Merci de nous indiquer ton email (ne sera pas afficher)
            </div>
            <div v-if="!$v.formFiche.email.email" class="invalid-feedback">
              Ton email doit être valide
            </div>
          </div>
          <button class="btn btn-primary w-100" type="submit" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm mr-2"
              role="status"
              aria-hidden="true"
            ></span>
            Envoyer
          </button>
        </form>
      </template>
    </b-modal>
    <article ref="fiche" class="fiche fiche-chouquettise">
      <div class="fiche-container d-flex justify-content-center">
        <div ref="ficheFront" class="fiche-front" :class="frontClass">
          <div ref="front" class="card bg-white">
            <div class="card-header p-0">
              <WpMedia
                v-if="featuredMedia"
                :media="featuredMedia"
                size="medium_large"
                :no-src-set="true"
                class="fiche-image"
              />
              <span
                class="fiche-category-icon rounded-circle"
                :class="fiche.info.chouquettise ? 'bg-yellow' : 'bg-white'"
              >
                <img :src="fiche.main_category.logo" alt="" title="Sur le pouce" width="35" height="35" />
              </span>
            </div>
            <div class="card-body d-flex flex-column position-relative">
              <h2 class="card-title text-center h4">{{ fiche.title.rendered | heDecode }}</h2>
              <p class="card-text" v-html="fiche.content.rendered" />
              <div v-if="fiche.info.chouquettise" class="card-text d-flex justify-content-around mt-auto">
                <a
                  v-if="fiche.info.telephone"
                  :href="`tel: ${fiche.info.telephone}`"
                  title="Appeler"
                  target="_blank"
                  class="fiche-social border border-secondary rounded-circle"
                  ><i class="fas fa-phone"></i
                ></a>
                <a
                  v-if="fiche.info.mail"
                  href=""
                  title="Envoyer un message"
                  class="fiche-social border border-secondary rounded-circle"
                  @click.prevent="openContactModal"
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
                href=""
                class="fiche-report"
                @click.prevent="openReportModal"
                ><i class="fas fa-exclamation-circle"></i
              ></a>
            </div>
            <div class="card-footer">
              <nuxt-link
                :to="{ path: `/${fiche.latest_post.slug}` }"
                :title="`Lire le dernier article : ${fiche.latest_post.title}`"
                class="btn btn-outline-secondary"
              >
                <i class="far fa-newspaper"></i>
              </nuxt-link>
              <a
                href=""
                title="Plus de détails"
                class="btn btn-yellow border-secondary float-right"
                :class="{ 'd-md-none': responsive }"
                @click.prevent="isFlipped = !isFlipped"
                ><i class="fas fa-plus"></i
              ></a>
            </div>
          </div>
        </div>
        <div ref="ficheBack" class="fiche-back" :class="backClass">
          <div ref="back" class="card bg-white">
            <div v-show="marker" ref="ficheMap" class="card-header p-0"></div>
            <div class="card-body position-relative p-0 pt-2">
              <ul v-if="fiche.info.chouquettise" class="list-group list-group-flush">
                <li v-if="fiche.info.website" class="list-group-item">
                  <a :href="fiche.info.website" title="Site Internet" target="_blank" class="text-decoration-none"
                    ><i class="fas fa-globe"></i> {{ fiche.info.website }}
                  </a>
                </li>
                <li v-if="fiche.info.telephone" class="list-group-item">
                  <a
                    :href="`tel: ${fiche.info.telephone}`"
                    title="Téléphone"
                    target="_blank"
                    class="text-decoration-none"
                    ><i class="fas fa-phone"></i> {{ fiche.info.telephone }}
                  </a>
                </li>
                <li v-if="fiche.info.mail" class="list-group-item">
                  <a
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
                <div v-if="criteria">
                  <span v-for="crit in criteriaList" :key="crit.id" class="badge badge-pill badge-light-grey mr-1">{{
                    crit.name
                  }}</span>
                </div>
              </div>
              <a
                title="Reporter une précision ou erreur sur la fiche"
                href=""
                class="fiche-report"
                @click.prevent="openReportModal"
                ><i class="fas fa-exclamation-circle"></i
              ></a>
            </div>
            <div class="card-footer">
              <nuxt-link
                :to="{ path: `/${fiche.latest_post.slug}` }"
                :title="`Lire le dernier article : ${fiche.latest_post.title}`"
                class="btn btn-outline-secondary"
              >
                <i class="far fa-newspaper"></i>
              </nuxt-link>
              <a
                href=""
                title="Plus de détails"
                class="btn btn-primary border-secondary float-right"
                :class="{ 'd-md-none': responsive }"
                @click.prevent="isFlipped = !isFlipped"
                ><i class="fas fa-plus"></i
              ></a>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import moment from 'moment'
import _ from 'lodash'

import WpMedia from './WpMedia'
import { MAP_OPTIONS } from '~/constants/mapSettings'
import modal from '~/mixins/modal'

export default {
  components: { WpMedia },
  mixins: [modal],
  props: {
    fiche: {
      type: Object,
      required: true
    },
    responsive: {
      type: Boolean,
      default: true
    }
  },
  validations: {
    formFiche: {
      name: {
        required
      },
      email: {
        required,
        email
      },
      message: {
        required,
        minText: minLength(10)
      }
    }
  },
  data() {
    return {
      isFlipped: false,
      featuredMedia: null,
      criteria: null,

      google: null,
      map: null,
      marker: null,

      isContactModal: true,
      formFiche: {
        name: null,
        email: null,
        message: null
      },
      loading: false
    }
  },
  computed: {
    frontClass() {
      return {
        flipped: !this.responsive && this.isFlipped,
        'flipped-responsive': this.responsive && this.isFlipped,
        'mx-md-3': this.responsive
      }
    },
    backClass() {
      return {
        flipped: !this.responsive && !this.isFlipped,
        'flipped-responsive': this.responsive && !this.isFlipped,
        'mx-md-3': this.responsive
      }
    },
    currentURL() {
      return process.client ? window.location.host : ''
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
      const criteriaList = Object.values(this.criteria).flat()
      const termsList = criteriaList.flatMap(({ values }) => values)
      return _.uniqBy(termsList, 'slug')
    }
  },
  watch: {
    fiche() {
      // remove marker
      if (this.marker) {
        this.marker.setMap(null)
        this.marker = null
      }

      this.init()
    }
  },
  async mounted() {
    const GoogleMapsApiLoader = require('google-maps-api-loader')
    try {
      this.google = await GoogleMapsApiLoader({
        apiKey: process.env.googleMapsKey
      })
      this.map = new this.google.maps.Map(this.$refs.ficheMap, MAP_OPTIONS)
    } catch (err) {
      if (err instanceof Error) console.error(err)
      else throw err
    }

    this.init()
  },
  methods: {
    openContactModal() {
      this.isContactModal = true
      this.$refs.ficheModal.toggle()
    },
    openReportModal() {
      this.isContactModal = false
      this.$refs.ficheModal.toggle()
    },
    async postMessage(isContactForm) {
      this.$v.formFiche.$touch()
      if (!this.$v.formFiche.$invalid) {
        this.loading = true
        // Get recaptcha token
        await this.$recaptchaLoaded()
        // Execute reCAPTCHA with action "login".
        const token = await this.$recaptcha('report')

        const data = {
          name: this.formFiche.name,
          email: this.formFiche.email,
          message: this.formFiche.message,
          recaptcha: token
        }

        // post report
        try {
          if (isContactForm) {
            await this.$wpAPI.wp.fiches.postContact(this.fiche.id, data)
            this.$store.dispatch('alerts/addAction', {
              type: 'success',
              message: `Nous avons bien envoyé ton message à ${this.$options.filters.heDecode(
                this.fiche.title.rendered
              )}.`
            })
          } else {
            await this.$wpAPI.wp.fiches.postReport(this.fiche.id, data)
            this.$store.dispatch('alerts/addAction', {
              type: 'success',
              message:
                'Ton message nous est bien parvenu : merci :-). Nous modifierons le contenu de la fiche sous peu.'
            })
          }

          this.formFiche.message = null
          this.$v.formFiche.$reset()
          this.$refs.ficheModal.hide()
        } catch (err) {
          this.$store.dispatch('alerts/addAction', { type: 'danger', message: err })
        } finally {
          this.loading = false
        }
      }
    },
    async init() {
      this.isFlipped = false
      this.featuredMedia = await this.$store.dispatch('media/fetchById', this.fiche.featured_media)
      this.criteria = this.$store.state.fiches.criteria[this.fiche.id]

      // add marker
      if (this.map && this.fiche.info.location) {
        this.infoWindow = new this.google.maps.InfoWindow({
          content: `<div class="text-center">${this.fiche.info.location.address}</div>`
        })

        this.marker = new this.google.maps.Marker({
          animation: this.google.maps.Animation.DROP,
          icon: this.fiche.main_category.marker_icon,
          map: this.map,
          position: this.fiche.info.location,
          title: this.fiche.title.rendered
        })
        this.marker.addListener('click', () => {
          this.toggleInfoWindow(this.infoWindow, this.map, this.marker)
        })

        this.map.setCenter(this.fiche.info.location)
        this.toggleInfoWindow(this.infoWindow, this.map, this.marker)
      }

      this.$nextTick(() => this.resizeFiche()) // needs time to display fiche before computing its size
    },
    toggleInfoWindow(infoWindow, map, marker) {
      if (!infoWindow.isOpen) {
        infoWindow.isOpen = true
        infoWindow.open(map, marker)
      } else {
        infoWindow.isOpen = false
        infoWindow.close()
      }
    },
    resizeFiche() {
      const $ = require('jquery')

      const frontElement = $(this.$refs.front)
      const backElement = $(this.$refs.back)

      // reset height
      frontElement.height('auto')
      backElement.height('auto')

      if (frontElement.height() > backElement.height()) {
        backElement.height(frontElement.height())
      } else {
        frontElement.height(backElement.height())
      }
    },
    getOpening(dayOfWeek = new Date().getDay()) {
      const opening = this.fiche.info.openings[dayOfWeek]
      return opening.includes('closed') ? 'fermé' : opening
    }
  }
}
</script>

<style lang="scss" scoped>
.fiche-front,
.fiche-back {
  width: 300px;
  max-width: 100%;

  @include media-breakpoint-down(sm) {
    width: 100%;
  }

  .card-body {
    min-height: unset;
  }

  .card-footer {
    height: 64px;
  }

  &.flipped {
    position: absolute;
    visibility: hidden;
  }

  &.flipped-responsive {
    @include media-breakpoint-down(sm) {
      position: absolute;
      visibility: hidden;
    }
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
