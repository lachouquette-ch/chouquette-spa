<template>
  <div>
    <v-card flat>
      <Media :media="fiche.image" size="medium_large" width="100%" :aspect-ratio="16 / 9" class="rounded-lg">
        <v-chip v-if="fiche.isChouquettise" color="cq-yellow" text-color="black" small class="ma-2">
          Testé et Chouquettisé
          <v-icon right>mdi-check</v-icon>
        </v-chip>
      </Media>
      <v-card-title class="mt-2 px-0 pt-0 flex-nowrap align-baseline">
        <h1>{{ fiche.title }}</h1>
        <v-spacer></v-spacer>
        <div class="d-flex">
          <v-btn v-if="fiche.info.facebook" fab icon small :href="fiche.info.facebook" target="_blank"
            ><v-icon color="#4267b2">mdi-facebook</v-icon></v-btn
          >
          <v-btn v-if="fiche.info.instagram" fab icon small :href="fiche.info.instagram" target="_blank"
            ><v-icon color="#E1306C">mdi-instagram</v-icon></v-btn
          >
        </div>
      </v-card-title>
      <v-card-subtitle class="px-0 secondary--text">
        <span v-if="fiche.locationId">{{ getLocationById(fiche.locationId).name }} - </span>{{ categories }}
      </v-card-subtitle>
      <p v-html="fiche.content"></p>

      <v-divider class="my-3"></v-divider>

      <div v-if="fiche.isChouquettise && values.length" class="mt-2">
        <h2 class="mb-2">Valeurs</h2>
        <v-chip-group>
          <v-tooltip v-for="value in values" :key="value.id" max-width="90vw" top>
            <template #activator="{ on, attrs }">
              <v-chip v-bind="attrs" color="cq-blue-light" text-color="cq-secondary" label small v-on="on">
                {{ value.name }}
              </v-chip>
            </template>
            {{ value.description }}
          </v-tooltip>
        </v-chip-group>
      </div>

      <h2 class="mt-2">Informations</h2>
      <v-tabs v-model="tab" class="mt-3" color="primary" background-color="white" grow>
        <v-tab key="contact">Contact</v-tab>
        <v-tab key="infos">+ d'infos</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" class="py-3" :touchless="tabTouchless">
        <v-tab-item key="contact">
          <div v-if="fiche.poi">
            <FichesMap
              :fiches="[fiche]"
              style="height: 200px"
              preview
              @fullScreenOn="tabTouchless = true"
              @fullScreenOff="tabTouchless = false"
            ></FichesMap>
            <span
              :href="`https://www.google.com/maps?q=${fiche.address}`"
              target="_blank"
              class="d-inline-block text-body-2 text-decoration-none mb-1"
              >{{ fiche.address }} <span class="text-decoration-underline">(Ouvrir dans Maps)</span></span
            >
          </div>

          <v-list v-if="fiche.isChouquettise" class="">
            <v-list-item
              @click="
                isContactForm = true
                showDialog = true
              "
            >
              <v-list-item-avatar size="30"><v-icon>mdi-message</v-icon></v-list-item-avatar>
              <v-list-item-title>
                <span class="text-decoration-underline">Envoyer un message à cette adresse</span>
                <v-list-item-subtitle class="text-caption">Depuis La Chouquette</v-list-item-subtitle>
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="fiche.info.telephone" :href="`tel: ${fiche.info.telephone}`">
              <v-list-item-avatar size="30"><v-icon>mdi-phone</v-icon></v-list-item-avatar>
              <v-list-item-title>
                <span class="text-decoration-underline">{{ fiche.info.telephone }}</span>
                <v-list-item-subtitle class="text-caption">Appeler l'adresse</v-list-item-subtitle>
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="fiche.info.website" :href="fiche.info.website" target="_blank">
              <v-list-item-avatar size="30"><v-icon>mdi-web</v-icon></v-list-item-avatar>
              <v-list-item-title>
                <span class="text-decoration-underline">Accéder au site Web</span>
                <v-list-item-subtitle class="text-caption">{{ fiche.info.website | prettyURL }}</v-list-item-subtitle>
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="fiche.info.mail"
              :href="`mailto:${fiche.info.mail}?body=%0A---%0AEnvoy%C3%A9%20depuis%20${currentURL}`"
            >
              <v-list-item-avatar size="30"><v-icon>mdi-at</v-icon></v-list-item-avatar>
              <v-list-item-title>
                <span class="text-decoration-underline">Envoyer un email</span>
                <v-list-item-subtitle class="text-caption">{{ fiche.info.mail }}</v-list-item-subtitle>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item key="infos">
          <v-list class="pa-0">
            <v-list-item
              v-if="fiche.info.cost"
              :to="`mailto:${fiche.info.mail}?body=%0A---%0AEnvoy%C3%A9%20depuis%20${currentURL}`"
              :inactive="true"
              :ripple="false"
            >
              <v-list-item-avatar size="30"><v-icon>mdi-cash</v-icon></v-list-item-avatar>
              <v-list-item-title>
                <span class="primary--text">{{ fichePrice[0] }}</span
                ><span class="cq-grey-light--text text--lighten-2">{{ fichePrice[1] }}</span>
                <v-list-item-subtitle class="text-caption">Budget estimé</v-list-item-subtitle>
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <v-menu v-if="fiche.info.openings" offset-y>
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-avatar size="30"><v-icon>mdi-clock</v-icon></v-list-item-avatar>
                <v-list-item-title>
                  Aujourd'hui : {{ getOpeningValue() }}
                  <v-list-item-subtitle class="text-decoration-underline text-caption"
                    >Voir les autres jours</v-list-item-subtitle
                  >
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-list dense>
              <v-list-item v-for="(item, index) in openingLabels" :key="index">
                <v-list-item-title>{{ item }} : {{ getOpeningValue(index) }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-list v-if="fiche.categoryFilters">
            <v-subheader>Cette adresse te propose&nbsp;
              <v-tooltip max-width="90vw" top>
                <template #activator="{ on, attrs }">
                  <v-icon v-bind="attrs" small v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                <span class="text-wrap"
                  >Ce sont les critères validés par cette adresse. Les critères te permettent notamment d'affiner tes
                  rechercher dans les filtres.</span
                >
              </v-tooltip>
            </v-subheader>
            <v-list-item>
              <v-list-item-content class="pa-0">
                <v-chip-group column>
                  <v-chip
                    v-for="categoryFilterValue in categoryFilterValues"
                    :key="categoryFilterValue.id"
                    color="cq-beige"
                    text-color="primary darken-2"
                    label
                    small
                  >
                    {{ categoryFilterValue.name }}</v-chip
                  >
                </v-chip-group>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
      <v-btn
        color="cq-red"
        :block="$vuetify.breakpoint.mobile"
        outlined
        @click.prevent="
          isContactForm = false
          showDialog = true
        "
        ><v-icon left>mdi-alert-circle-outline</v-icon>Signaler une erreur / précision</v-btn
      >

      <div v-if="fiche.postCards">
        <v-divider class="my-3"></v-divider>
        <h2 class="mb-3">Articles liés à l'adresse</h2>
        <div class="mb-5">
          <PostCard
            v-for="post in fiche.postCards"
            :key="post.id"
            :post="post"
            class="mb-3"
            :to="`/${post.slug}`"
            nuxt
          ></PostCard>
        </div>
      </div>

      <div v-if="fiche.similarFiches">
        <v-divider class="my-3"></v-divider>
        <h2>Adresses similaires</h2>
        <ReponsiveScrollGrid :items="fiche.similarFiches" md="3" :desktop-flex="dialog">
          <template #default="{ item }">
            <FicheCard :fiche="item" :to="`/fiche/${item.slug}`" height="100%" nuxt></FicheCard>
          </template>
        </ReponsiveScrollGrid>
      </div>
    </v-card>

    <v-dialog ref="ficheModal" v-model="showDialog" max-width="600px" @click:outside="clear">
      <v-form @submit.prevent="submit(isContactForm)">
        <v-card :loading="dialogLoading">
          <v-card-title>Formulaire de contact </v-card-title>
          <v-card-subtitle>
            <span v-if="isContactForm"
              >Une question, une demande, une réservation... écris-lui un petit mot directement ici</span
            >
            <span v-else>Une erreur, une remarque, une suggestion sur la fiche ? Merci de nous en faire part</span>
            <v-icon small>mdi-emoticon-happy-outline</v-icon>
          </v-card-subtitle>
          <v-card-text>
            <v-container class="pa-0">
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="formFiche.message"
                    :error-messages="messageErrors"
                    color="secondary"
                    label="Ton message *"
                    counter="300"
                    required
                    autofocus
                    @blur="$v.formFiche.message.$touch"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formFiche.name"
                    :error-messages="nameErrors"
                    name="name"
                    color="secondary"
                    label="Ton nom / prénom *"
                    required
                    @blur="$v.formFiche.name.$touch"
                    autocomplete="name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formFiche.email"
                    :error-messages="emailErrors"
                    name="email"
                    type="email"
                    color="secondary"
                    label="Ton email *"
                    required
                    @blur="$v.formFiche.email.$touch"
                    autocomplete="email"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-text>* champs obligatoires</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click.prevent="clear">Fermer</v-btn>
            <v-btn color="info" text :loading="dialogLoading" type="submit">Envoyer</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import { email, maxLength, minLength, required } from 'vuelidate/lib/validators'
import Media from '~/components/Media'
import FichesMap from '~/components/FichesMap'
import PostCard from '~/components/PostCard'
import FicheCard from '~/components/FicheCard'
import seo from '~/mixins/seo'
import ReponsiveScrollGrid from '~/components/ReponsiveScrollGrid'
import graphql from '~/mixins/graphql'

export default {
  components: { ReponsiveScrollGrid, FicheCard, PostCard, FichesMap, Media },
  mixins: [seo, graphql],
  props: {
    fiche: Object,
    dialog: Boolean,
  },
  validations: {
    formFiche: {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
      message: {
        required,
        minLength: minLength(20),
        maxLength: maxLength(300),
      },
    },
  },
  computed: {
    ...mapGetters('locations', {
      getLocationById: 'getById',
    }),
    ...mapGetters('categories', {
      getCategoryById: 'getById',
    }),
    ...mapGetters('values', {
      getValueById: 'getById',
    }),
    categories() {
      return this.fiche.categoryIds.map((id) => this.getCategoryById(id).name).join(', ')
    },
    values() {
      return this.fiche.valueIds.map(this.getValueById)
    },
    fichePrice() {
      return ['$'.repeat(this.fiche.info.cost), '$'.repeat(5 - this.fiche.info.cost)]
    },
    openingLabels() {
      return ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    },
    currentDayOfWeek() {
      return moment().locale('fr-CH').format('dddd')
    },
    categoryFilterValues() {
      return _.uniq(
        this.fiche.categoryFilters.flatMap((filter) => filter.values),
        'id'
      )
    },
    nameErrors() {
      const errors = []
      if (!this.$v.formFiche.name.$dirty) return errors
      !this.$v.formFiche.name.required && errors.push("Merci d'indiquer ton nom")
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.formFiche.email.$dirty) return errors
      !this.$v.formFiche.email.required && errors.push("Merci d'indiquer ton email")
      !this.$v.formFiche.email.email && errors.push("Merci d'indiquer un email valide")
      return errors
    },
    messageErrors() {
      const errors = []
      if (!this.$v.formFiche.message.$dirty) return errors
      !this.$v.formFiche.message.required && errors.push("Merci d'indiquer un message")
      !this.$v.formFiche.message.minLength && errors.push('Ton messasge doit comporter au moins 20 caractères')
      !this.$v.formFiche.message.maxLength && errors.push('Ton messasge doit comporter au maximum 300 caractères')
      return errors
    },
  },
  methods: {
    getOpeningValue(dayOfWeek = new Date().getDay()) {
      const opening = this.fiche.info.openings[dayOfWeek]
      if (opening) {
        return opening.includes('closed') ? 'fermé' : opening
      } else {
        return ''
      }
    },
    async submit(isContactForm) {
      this.$v.formFiche.$touch()
      if (!this.$v.formFiche.$invalid) {
        this.dialogLoading = true
        // Get recaptcha token
        await this.$recaptcha.init()
        // Execute reCAPTCHA with action "login".
        const token = await this.$recaptcha.execute(isContactForm ? 'report' : 'contact')

        const data = {
          name: this.formFiche.name,
          email: this.formFiche.email,
          message: this.formFiche.message,
          recaptcha: token,
        }

        // post report
        try {
          if (isContactForm) {
            // contact
            await this.$apollo.mutate({
              mutation: gql`
                mutation contactFicheOwner(
                  $ficheId: Int!
                  $name: String!
                  $email: String!
                  $message: String!
                  $recaptcha: String!
                ) {
                  contactFicheOwner(
                    ficheId: $ficheId
                    name: $name
                    email: $email
                    message: $message
                    recaptcha: $recaptcha
                  )
                }
              `,
              variables: {
                ficheId: parseInt(this.fiche.id),
                ...data,
              },
            })
            this.$store.dispatch('alerts/addAction', {
              type: 'success',
              message: `Nous avons bien envoyé ton message à ${this.fiche.title}.`,
            })
          } else {
            // report
            await this.$apollo.mutate({
              mutation: gql`
                mutation reportFicheInfo(
                  $ficheId: Int!
                  $name: String!
                  $email: String!
                  $message: String!
                  $recaptcha: String!
                ) {
                  reportFicheInfo(
                    ficheId: $ficheId
                    name: $name
                    email: $email
                    message: $message
                    recaptcha: $recaptcha
                  )
                }
              `,
              variables: {
                ficheId: parseInt(this.fiche.id),
                ...data,
              },
            })
            this.$store.dispatch('alerts/addAction', {
              type: 'success',
              message:
                'Ton message nous est bien parvenu : merci :-). Nous modifierons le contenu de la fiche sous peu.',
            })
          }

          this.clear()
          this.$refs.ficheModal.onClickOutside()
        } catch (e) {
          this.$sentry.captureException(e)
          this.handleGQLError(e, "L'envoi de ton message à échouer :")
        } finally {
          this.dialogLoading = false
        }
      }
    },
    clear() {
      this.$v.$reset()
      this.formFiche.email = null
      this.formFiche.name = null
      this.formFiche.message = null
      this.showDialog = false
    },
  },
  data() {
    return {
      posts: [],

      tab: null,
      tabTouchless: false,

      showDialog: false,
      isContactForm: false,
      dialogLoading: false,
      formFiche: {
        name: null,
        email: null,
        message: null,
      },
    }
  },
}
</script>

<style scoped></style>
