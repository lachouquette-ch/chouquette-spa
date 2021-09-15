<template>
  <v-sheet rounded elevation="1" class="px-2 py-4">
    <v-form @submit.prevent="postComment">
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
      <v-text-field
        :id="`email${_uid}`"
        v-model.trim="formComment.email"
        label="Ton email *"
        hint="Ton email ne sera pas publiée. Parole de Chouquette !"
        autocomplete="email"
        :error-messages="emailErrors"
        required
        @input="$v.formComment.email.$touch"
        @blur="$v.formComment.email.$touch"
      ></v-text-field>
      <v-text-field
        :id="`url${_uid}`"
        v-model.trim="formComment.webSite"
        label="Ton site web"
        :error-messages="webSiteErrors"
        required
        @input="$v.formComment.webSite.$touch"
        @blur="$v.formComment.webSite.$touch"
      ></v-text-field>

      <v-btn type="submit" :disabled="loading" :loading="loading" small>Envoyer ma réponse</v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
import {email, minLength, required, url} from 'vuelidate/lib/validators'

export default {
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
    async postComment() {
      this.$v.formComment.$touch()
      if (!this.$v.formComment.$invalid) {
        this.loading = true
        // Get recaptcha token
        await this.$recaptchaLoaded()
        // Execute reCAPTCHA with action "login".
        const token = await this.$recaptcha('comment')

        this.$wpAPI.wp.comments
          .postComment({
            post: this.post,
            parent: this.parent,
            author_name: this.formComment.name,
            author_email: this.formComment.email,
            content: this.formComment.comment,
            recaptcha: token,
          })
          .then((result) => {
            this.$store.dispatch('alerts/addAction', {
              type: 'success',
              message:
                'Ton commentaire nous est bien parvenu : merci :-). Il sera visible dès validation de notre part.',
            })

            // clear form
            this.formComment.comment = null
            this.$v.formComment.$reset()

            this.$emit('done')
          })
          .catch((error) =>
            this.$store.dispatch('alerts/addAction', { type: 'danger', message: error.response.data.message })
          )
          .finally(() => (this.loading = false))
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
