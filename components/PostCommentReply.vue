<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-form @submit.prevent="postComment">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-textarea
              :id="`comment${_uid}`"
              v-model="formComment.comment"
              label="Ton commentaire *"
              rows="4"
              :error-messages="commentErrors"
              :counter="true"
              required
              class="pt-0"
              @input="$v.formComment.comment.$touch"
              @blur="$v.formComment.comment.$touch"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :id="`author${_uid}`"
              v-model.trim="formComment.name"
              label="Ton nom *"
              autocomplete="name"
              :error-messages="nameErrors"
              required
              @input="$v.formComment.name.$touch"
              @blur="$v.formComment.name.$touch"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :id="`email${_uid}`"
              v-model.trim="formComment.email"
              label="Ton email *"
              hint="Ton email ne sera pas publié. Parole de Chouquette !"
              autocomplete="email"
              :error-messages="emailErrors"
              required
              @input="$v.formComment.email.$touch"
              @blur="$v.formComment.email.$touch"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :id="`url${_uid}`"
              v-model.trim="formComment.webSite"
              label="Ton site web"
              :error-messages="webSiteErrors"
              required
              @input="$v.formComment.webSite.$touch"
              @blur="$v.formComment.webSite.$touch"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="clear">Fermer</v-btn>
        <v-btn color="cq-blue" :loading="loading" type="submit">Envoyer</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { email, minLength, required, url } from 'vuelidate/lib/validators'
import gql from 'graphql-tag'
import graphql from '~/mixins/graphql'

export default {
  mixins: [graphql],
  props: {
    post: {
      type: String,
      required: true,
    },
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formComment: {
        name: null,
        email: null,
        webSite: null,
        comment: null,
      },
      loading: false,
    }
  },
  methods: {
    clear() {
      this.formComment.name = null
      this.formComment.email = null
      this.formComment.webSite = null
      this.formComment.comment = null
      this.$v.formComment.$reset()
      this.$emit('close')
    },
    async postComment() {
      this.$v.formComment.$touch()
      if (!this.$v.formComment.$invalid) {
        this.loading = true
        // Get recaptcha token
        await this.$recaptcha.init()
        // Execute reCAPTCHA with action "comment".
        const token = await this.$recaptcha.execute('comment')

        const data = {
          postId: parseInt(this.post),
          parentId: parseInt(this.parent),
          authorName: this.formComment.name,
          authorEmail: this.formComment.email,
          content: this.formComment.comment,
          recaptcha: token,
        }

        try {
          await this.$apollo.mutate({
            mutation: gql`
              mutation commentPost(
                $postId: Int!
                $parentId: Int
                $authorName: String!
                $authorEmail: String!
                $content: String!
                $recaptcha: String!
              ) {
                commentPost(
                  postId: $postId
                  parentId: $parentId
                  authorName: $authorName
                  authorEmail: $authorEmail
                  content: $content
                  recaptcha: $recaptcha
                )
              }
            `,
            variables: {
              ...data,
            },
          })
          this.$store.dispatch('alerts/addAction', {
            type: 'success',
            message: 'Ton commentaire nous est bien parvenu : merci :-). Il sera visible dès validation de notre part.',
          })

          // clear form
          this.formComment.comment = null
          this.$v.formComment.$reset()

          this.$emit('close')
        } catch (e) {
          this.$sentry.captureException(e)
          this.handleGQLError(e, "Ton commentaire n'a pas pu être envoyé")
        } finally {
          this.loading = false
        }
      }
    },
  },
  validations: {
    formComment: {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
      webSite: {
        url,
      },
      comment: {
        required,
        minText: minLength(30),
      },
    },
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.formComment.name.$dirty) return errors
      !this.$v.formComment.name.required && errors.push("Merci d'inscrire ton nom")
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.formComment.email.$dirty) return errors
      !this.$v.formComment.email.required && errors.push("Merci d'inscrire ton adresse mail")
      !this.$v.formComment.email.email && errors.push("Merci d'inscrire une adresse mail valide")
      return errors
    },
    webSiteErrors() {
      const errors = []
      if (!this.$v.formComment.webSite.$dirty) return errors
      !this.$v.formComment.webSite.url && errors.push("Merci d'inscrire un lien valide")
      return errors
    },
    commentErrors() {
      const errors = []
      if (!this.$v.formComment.comment.$dirty) return errors
      !this.$v.formComment.comment.required && errors.push('Il faut du contenu à ton commentaire')
      !this.$v.formComment.comment.minText && errors.push('Ton commentaire doit avoir un minimum de contenu')
      return errors
    },
  },
}
</script>

<style scoped></style>
