<template>
  <div class="fiche-container d-flex">
    <!--    <b-modal ref="ficheModal" title-class="w-100 text-center" hide-footer centered @shown="focusOn('message')">-->
    <!--      <template v-slot:modal-title>{{ fiche.title.rendered | heDecode }}</template>-->
    <!--      <template v-slot:default>-->
    <!--        <form @submit.prevent="postMessage(isContactModal)">-->
    <!--          <label v-if="isContactModal">-->
    <!--            Une question, une demande, une réservation... écris-lui un petit mot directement ici-->
    <!--            <i class="far fa-smile"></i>-->
    <!--          </label>-->
    <!--          <label v-else>-->
    <!--            Une erreur, une remarque, une suggestion sur la fiche ? Merci de nous en faire part-->
    <!--            <i class="far fa-smile"></i>-->
    <!--          </label>-->
    <!--          <div class="form-group">-->
    <!--            <label v-if="isContactModal" for="ficheModalText">Ton message *</label>-->
    <!--            <label v-else for="ficheModalText">Ton commentaire *</label>-->
    <!--            <textarea-->
    <!--              id="ficheModalText"-->
    <!--              ref="message"-->
    <!--              v-model="formFiche.message"-->
    <!--              class="form-control"-->
    <!--              :class="{ 'is-invalid': $v.formFiche.message.$error }"-->
    <!--              rows="8"-->
    <!--              @blur="$v.formFiche.message.$touch"-->
    <!--            ></textarea>-->
    <!--            <div v-if="!$v.formFiche.message.required" class="invalid-feedback">-->
    <!--              Il faut un contenu à ton message-->
    <!--            </div>-->
    <!--            <div v-if="!$v.formFiche.message.minText" class="invalid-feedback">-->
    <!--              Ton message doit avoir un minimum de contenu-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <div class="form-group">-->
    <!--            <label for="ficheModalName">Ton prénom / nom *</label>-->
    <!--            <input-->
    <!--              id="ficheModalName"-->
    <!--              v-model="formFiche.name"-->
    <!--              name="name"-->
    <!--              class="form-control"-->
    <!--              :class="{ 'is-invalid': $v.formFiche.name.$error }"-->
    <!--              @blur="$v.formFiche.name.$touch"-->
    <!--            />-->
    <!--            <div v-if="!$v.formFiche.name.required" class="invalid-feedback">-->
    <!--              Merci de nous indiquer ton ptit nom-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <div class="form-group">-->
    <!--            <label for="ficheModalMail">Ton mail *</label>-->
    <!--            <input-->
    <!--              id="ficheModalMail"-->
    <!--              v-model="formFiche.email"-->
    <!--              type="email"-->
    <!--              name="email"-->
    <!--              class="form-control"-->
    <!--              :class="{ 'is-invalid': $v.formFiche.email.$error }"-->
    <!--              @blur="$v.formFiche.email.$touch"-->
    <!--            />-->
    <!--            <div v-if="!$v.formFiche.email.required" class="invalid-feedback">-->
    <!--              Merci de nous indiquer ton email (ne sera pas afficher)-->
    <!--            </div>-->
    <!--            <div v-if="!$v.formFiche.email.email" class="invalid-feedback">-->
    <!--              Ton email doit être valide-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <button class="btn btn-primary w-100" type="submit" :disabled="loading">-->
    <!--            <b-spinner v-show="loading" small variant="yellow" label="chargement" class="mr-2"></b-spinner>-->
    <!--            Envoyer-->
    <!--          </button>-->
    <!--        </form>-->
    <!--      </template>-->
    <!--    </b-modal>-->
    <article ref="fiche" class="fiche fiche-chouquettise w-100 d-flex justify-content-center align-items-stretch">
      <div ref="ficheFront" class="fiche-front h-100 d-flex" :class="frontClass">
        <div ref="front" class="h-100 w-100 card bg-white">
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
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="card-text" v-html="fiche.content.rendered"></div>
            <div v-if="fiche.info.chouquettise" class="card-text d-flex justify-content-around mt-auto">
              <a
                v-if="fiche.info.mail"
                href=""
                title="Envoyer un message"
                class="fiche-social border border-secondary rounded-circle"
                @click.prevent="openContactModal"
                ><i class="far fa-envelope"></i
              ></a>
              <a
                v-if="fiche.info.telephone"
                :href="`tel: ${fiche.info.telephone}`"
                title="Appeler"
                target="_blank"
                class="fiche-social border border-secondary rounded-circle"
                ><i class="fas fa-phone-alt"></i
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
            <slot name="front-footer"></slot>
            <FicheShare :fiche="fiche" />
            <nuxt-link
              v-if="latestPost"
              :to="{ path: `/${latestPost.slug}` }"
              :title="`Lire le dernier article : ${latestPost.title}`"
              class=" btn btn-sm btn-outline-secondary"
            >
              <i class="far fa-newspaper"></i>
            </nuxt-link>
            <a
              href=""
              title="Plus de détails"
              class="btn btn-sm btn-outline-secondary float-right"
              :class="{ 'd-md-none': flatEnable }"
              @click.prevent="isFlipped = true"
            >
              Voir <span class="ml-1"><i class="fas fa-plus"></i></span>
            </a>
          </div>
        </div>
      </div>
      <!--      <div ref="ficheBack" class="fiche-back h-100 d-flex" :class="backClass">-->
      <!--        <div ref="back" class="h-100 w-100 card bg-white">-->
      <!--          <div v-if="fiche.info.location" class="card-header p-0">-->
      <!--            <div v-show="marker" ref="ficheMap" class="h-100"></div>-->
      <!--          </div>-->
      <!--          <div class="card-body position-relative p-0 pt-2">-->
      <!--            <ul v-if="fiche.info.chouquettise" class="list-group list-group-flush">-->
      <!--              <li v-if="fiche.info.website" class="list-group-item ellipses">-->
      <!--                <a :href="fiche.info.website" title="Site Internet" target="_blank"-->
      <!--                  ><i class="fas fa-globe"></i> {{ fiche.info.website | prettyURL }}-->
      <!--                </a>-->
      <!--              </li>-->
      <!--              <li v-if="fiche.info.telephone" class="list-group-item">-->
      <!--                <a :href="`tel: ${fiche.info.telephone}`" title="Téléphone" target="_blank"-->
      <!--                  ><i class="fas fa-phone"></i> {{ fiche.info.telephone }}-->
      <!--                </a>-->
      <!--              </li>-->
      <!--              <li v-if="fiche.info.mail" class="list-group-item ellipses">-->
      <!--                <a-->
      <!--                  :href="`mailto:${fiche.info.mail}?body=%0A-&#45;&#45;%0AEnvoy%C3%A9%20depuis%20${currentURL}`"-->
      <!--                  title="Email"-->
      <!--                  target="_blank"-->
      <!--                  ><i class="fas fa-at"></i> {{ fiche.info.mail }}-->
      <!--                </a>-->
      <!--              </li>-->
      <!--              <li v-if="fiche.info.cost" class="list-group-item">-->
      <!--                <label class="mb-0">Prix :</label>-->
      <!--                <span class="fiche-price fiche-price-selected">{{ fichePrice[0] }}</span-->
      <!--                ><span class="fiche-price">{{ fichePrice[1] }}</span>-->
      <!--              </li>-->
      <!--              <li v-if="fiche.info.openings" class="list-group-item">-->
      <!--                <label class="mb-0">Horaires :</label>-->
      <!--                <b-dropdown-->
      <!--                  class="fiche-planning"-->
      <!--                  variant="link"-->
      <!--                  toggle-tag="span"-->
      <!--                  toggle-class="text-black d-inline-block p-0 border-0"-->
      <!--                  dropup-->
      <!--                  right-->
      <!--                >-->
      <!--                  <template v-slot:button-content> {{ getOpening() }} ({{ currentDayOfWeek }}) </template>-->
      <!--                  <template v-slot:default>-->
      <!--                    <b-dropdown-text><label class="mb-0">Lundi</label>{{ getOpening(1) }}</b-dropdown-text>-->
      <!--                    <b-dropdown-text><label class="mb-0">Mardi</label>{{ getOpening(2) }}</b-dropdown-text>-->
      <!--                    <b-dropdown-text><label class="mb-0">Mercredi</label>{{ getOpening(3) }}</b-dropdown-text>-->
      <!--                    <b-dropdown-text><label class="mb-0">Jeudi</label>{{ getOpening(4) }}</b-dropdown-text>-->
      <!--                    <b-dropdown-text><label class="mb-0">Vendredi</label>{{ getOpening(5) }}</b-dropdown-text>-->
      <!--                    <b-dropdown-text><label class="mb-0">Samedi</label>{{ getOpening(6) }}</b-dropdown-text>-->
      <!--                    <b-dropdown-text><label class="mb-0">Dimanche</label>{{ getOpening(0) }}</b-dropdown-text>-->
      <!--                  </template>-->
      <!--                </b-dropdown>-->
      <!--              </li>-->
      <!--            </ul>-->
      <!--            <div class="card-text p-3">-->
      <!--              <div v-if="criteria">-->
      <!--                <span-->
      <!--                  v-for="value in criteriaList"-->
      <!--                  :key="value.id"-->
      <!--                  class="badge badge-pill badge-light-grey font-weight-normal mr-1"-->
      <!--                  >{{ value.name }}</span-->
      <!--                >-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            <a-->
      <!--              title="Reporter une précision ou erreur sur la fiche"-->
      <!--              href=""-->
      <!--              class="fiche-report"-->
      <!--              @click.prevent="openReportModal"-->
      <!--              ><i class="fas fa-exclamation-circle"></i-->
      <!--            ></a>-->
      <!--          </div>-->
      <!--          <div class="card-footer">-->
      <!--            <nuxt-link-->
      <!--              v-if="!noRefLink"-->
      <!--              :to="{ path: `/fiche/${fiche.slug}` }"-->
      <!--              title="Page de la fiche"-->
      <!--              class=" btn btn-sm btn-outline-secondary"-->
      <!--            >-->
      <!--              <i class="fas fa-external-link-alt"></i>-->
      <!--              <span class="ml-1">Ouvrir la fiche</span>-->
      <!--            </nuxt-link>-->
      <!--            <a-->
      <!--              href=""-->
      <!--              title="Retour sur les informations principales"-->
      <!--              class="btn btn-sm btn-outline-secondary float-right"-->
      <!--              :class="{ 'd-md-none': flatEnable }"-->
      <!--              @click.prevent="isFlipped = false"-->
      <!--            >-->
      <!--              Retour-->
      <!--            </a>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </article>
  </div>
</template>

<script>
import { email, minLength, required } from 'vuelidate/lib/validators'
import moment from 'moment'
import _ from 'lodash'

import WpMedia from './WpMedia'
import { MAP_OPTIONS } from '~/constants/mapSettings'
import modal from '~/mixins/modal'
import FicheShare from '~/components/FicheShare'

export default {
  components: { FicheShare, WpMedia },
  mixins: [modal],
  props: {
    fiche: {
      type: Object,
      required: true
    },
    flatEnable: Boolean,
    noRefLink: Boolean
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
        hide: this.isFlipped,
        'flat-enable': this.flatEnable,
        'mx-md-3': this.flatEnable
      }
    },
    backClass() {
      return {
        hide: !this.isFlipped,
        'flat-enable': this.flatEnable,
        'mx-md-3': this.flatEnable
      }
    },
    currentURL() {
      return process.client ? window.location.host : ''
    },
    latestPost() {
      return _.isEmpty(this.fiche.linked_posts) ? null : this.fiche.linked_posts[0]
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
    },
    featuredMedia() {
      return this.$store.state.media.all[this.fiche.featured_media]
    },
    criteria() {
      return this.$store.state.fiches.criteria[this.fiche.id]
    }
  },
  async mounted() {
    if (this.fiche.info.location) {
      try {
        this.google = await this.$googleMaps
        this.map = new this.google.maps.Map(this.$refs.ficheMap, {
          ...MAP_OPTIONS,
          gestureHandling: 'none',
          zoomControl: false
        })

        // toggle gesture if fullscreen
        document.addEventListener(
          'fullscreenchange',
          (event) => {
            if (document.fullscreenElement) {
              this.map.gestureHandling = 'auto'
              this.map.zoomControl = true
            } else {
              this.map.gestureHandling = 'none'
              this.map.zoomControl = false
              // center map
              this.map.setCenter(this.marker.position)
              this.infoWindow.open(this.map, this.marker) // force to center on infoWindow too
            }
          },
          { passive: 'true' }
        )
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
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
    init() {
      this.isFlipped = false

      this.initMap()
    },
    initMap() {
      // remove marker in any
      if (this.marker) {
        this.marker.setMap(null)
        this.marker = null
      }
      // add marker
      if (this.map) {
        this.infoWindow = new this.google.maps.InfoWindow({
          content: `<div class="text-center">${this.fiche.info.location.address}</div>`
        })
        this.marker = new this.google.maps.Marker({
          animation: this.google.maps.Animation.DROP,
          icon: this.fiche.main_category.marker_icon,
          map: this.map,
          position: this.fiche.info.location,
          title: this.$options.filters.heDecode(this.fiche.title.rendered)
        })

        this.map.setCenter(this.marker.getPosition())
        this.infoWindow.open(this.map, this.marker)
      }
    },
    getOpening(dayOfWeek = new Date().getDay()) {
      const opening = this.fiche.info.openings[dayOfWeek]
      if (opening) {
        return opening.includes('closed') ? 'fermé' : opening
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fiche-container {
  min-height: 500px;
}

.fiche-front,
.fiche-back {
  &.hide:not(.flat-enable) {
    position: absolute;
    visibility: hidden;
  }

  &.hide.flat-enable {
    @include media-breakpoint-down(sm) {
      position: absolute;
      visibility: hidden;
    }
  }

  width: 300px;
  max-width: 100%;

  @include media-breakpoint-down(sm) {
    width: 100%;
  }

  a {
    color: $black;
  }

  .card {
    @include hover-focus {
      box-shadow: $box-shadow !important;
    }
  }

  .card-body {
    min-height: unset;

    .list-group-item.ellipses {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .card-footer {
    height: 56px;
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

::v-deep div.gm-style-iw-d + button {
  display: none !important;
}
</style>
