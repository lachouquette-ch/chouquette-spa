<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <v-container class="mb-3 cq-md-max-width">
      <div class="text-center">
        <h1 class="mb-3">Nous contacter</h1>
        <p>Un coucou, une suggestion ? L'envie de te Chouquettiser ?, …</p>
        <p>N'hésite pas et écris-nous !</p>
        <p>À très vite</p>
      </div>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formContact.name"
            :error-messages="nameErrors"
            name="name"
            color="secondary"
            label="Prénom, nom (et société) *"
            required
            @blur="$v.formContact.name.$touch"
            autocomplete="name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formContact.email"
            :error-messages="emailErrors"
            type="email"
            name="email"
            color="secondary"
            label="Email *"
            required
            @blur="$v.formContact.email.$touch"
            autocomplete="email"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formContact.subject"
            :error-messages="subjectErrors"
            name="subject"
            color="secondary"
            label="Sujet *"
            required
            @blur="$v.formContact.subject.$touch"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="formContact.to"
            :error-messages="toErrors"
            color="secondary"
            label="Destinataire *"
            :items="to"
            @blur="$v.formContact.to.$touch"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="mb-3">
        <v-col cols="12">
          <v-textarea
            v-model="formContact.message"
            :error-messages="messageErrors"
            color="secondary"
            label="Ton message *"
            counter="300"
            required
            @blur="$v.formContact.message.$touch"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-btn color="primary" :loading="loading" @click="postMessage">Envoyer</v-btn>
      <small class="right"><em>* champs obligatoires</em></small>
    </v-container>
    <Newsletter />
  </div>
</template>

<script>
import {email, maxLength, minLength, required} from 'vuelidate/lib/validators'
import _ from 'lodash'
import gql from 'graphql-tag'
import Newsletter from '~/components/Newsletter'
import seo from '~/mixins/seo'
import graphql from '~/mixins/graphql'

const recipients = ['hello','webmaster']
const mustMatchRecipients = (value) => {
  return !value || recipients.includes(value)
}

export default {
  components: { Newsletter },
  mixins: [seo, graphql],
  data() {
    return {
      formContact: {
        name: null,
        email: null,
        subject: null,
        to: null,
        message: null,
      },
      loading: false,

      to: [
        { text: 'Général (infos, suggestions, partenariats, chouquettisation, ...)', value: 'hello' },
        { text: 'Webmaster (tout ce qui concerne le site)', value: 'webmaster' },
      ],
    }
  },
  methods: {
    async postMessage() {
      this.$v.formContact.$touch()
      if (!this.$v.formContact.$invalid) {
        try {
          this.loading = true
          // Get recaptcha token
          await this.$recaptcha.init()
          // Execute reCAPTCHA with action "login".
          const token = await this.$recaptcha.execute('contact')

          await this.$apollo.mutate({
            mutation: gql`
              mutation contactStaff(
                $name: String!
                $email: String!
                $subject: String!
                $to: String!
                $message: String!
                $recaptcha: String!
              ) {
                contactStaff(
                  name: $name
                  email: $email
                  subject: $subject
                  to: $to
                  message: $message
                  recaptcha: $recaptcha
                )
              }
            `,
            variables: {
              ...this.formContact,
              recaptcha: token,
            },
          })

          this.$store.dispatch('alerts/addAction', {
            type: 'success',
            message: 'Ton message nous est bien parvenu : merci :-). On te répondra dès que possible.',
          })

          // clear form
          this.formContact = _.mapValues(this.formContact, () => null)
          this.$v.formContact.$reset()

          this.$emit('done')
        } catch (e) {
          this.$sentry.captureException(e)
          this.handleGQLError(e, "L'envoi de ton message à échouer :")
        } finally {
          this.loading = false
        }
      }
    },
  },
  validations: {
    formContact: {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
      subject: {
        required,
      },
      to: {
        required,
        mustMatchRecipients,
      },
      message: {
        required,
        minLength: minLength(30),
        maxLength: maxLength(300),
      },
    },
  },
  head() {
    return {
      title: "Contacte un membre de l'équipe La Chouquette",
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: 'Contacte-nous',
          description: "Contacte un membre de l'équipe La Chouquette",
          publisher: {
            '@type': 'Organization',
            name: 'La Chouquette',
            logo: `${this.$config.siteUrl}/logo.png`,
          },
          url: this.currentURL,
        }),
      ],
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.formContact.name.$dirty) return errors
      !this.$v.formContact.name.required && errors.push("Merci d'indiquer ton nom")
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.formContact.email.$dirty) return errors
      !this.$v.formContact.email.required && errors.push("Merci d'indiquer ton email")
      !this.$v.formContact.email.email && errors.push("Merci d'indiquer un email valide")
      return errors
    },
    subjectErrors() {
      const errors = []
      if (!this.$v.formContact.subject.$dirty) return errors
      !this.$v.formContact.subject.required && errors.push("Merci d'indiquer un sujet")
      return errors
    },
    toErrors() {
      const errors = []
      if (!this.$v.formContact.to.$dirty) return errors
      !this.$v.formContact.to.required && errors.push("Merci d'indiquer le destinataire")
      !this.$v.formContact.to.mustMatchRecipients && errors.push("Merci d'indiquer le destinataire")
      return errors
    },
    messageErrors() {
      const errors = []
      if (!this.$v.formContact.message.$dirty) return errors
      !this.$v.formContact.message.required && errors.push("Merci d'indiquer un message")
      !this.$v.formContact.message.minLength && errors.push('Ton messasge doit comporter au moins 30 caractères')
      !this.$v.formContact.message.maxLength && errors.push('Ton messasge doit comporter au maximum 300 caractères')
      return errors
    },
  },
}
</script>

<style lang="scss" scoped></style>
