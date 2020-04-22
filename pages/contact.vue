<template>
  <div class="contact-page container layout-content my-5">
    <h1 class="text-center mb-4">Contacter l'équipe Chouquette</h1>
    <div class="text-center">
      <p>Un coucou, une suggestion ?, une envie de te Chouquettiser ?, …</p>
      <p>
        Cool ! Alors écris-nous à &nbsp;<a href="mailto:hello@lachouquette.ch">hello@lachouquette.ch</a>&nbsp; ou à
        travers ce formulaire. Merci et à très vite !
      </p>
    </div>
    <form class="mt-5" @submit.prevent="postMessage">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="name">Nom (et société) *</label>
          <input
            id="name"
            v-model="formContact.name"
            :class="{ 'is-invalid': $v.formContact.name.$error }"
            type="text"
            class="form-control"
            placeholder="Nom"
            name="name"
            autofocus
            @blur="$v.formContact.name.$touch"
          />
          <div v-if="$v.formContact.name.$error" class="invalid-feedback">
            Merci de nous indiquer ton ptit nom
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="mail">Email *</label>
          <input
            id="mail"
            v-model="formContact.email"
            :class="{ 'is-invalid': $v.formContact.email.$error }"
            type="email"
            name="email"
            class="form-control"
            placeholder="Email"
            @blur="$v.formContact.email.$touch"
          />
          <div v-if="$v.formContact.email.$error" class="invalid-feedback">
            Merci de remplir un email correct
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="subject">Sujet *</label>
          <input
            id="subject"
            v-model="formContact.subject"
            :class="{ 'is-invalid': $v.formContact.subject.$error }"
            type="text"
            class="form-control"
            placeholder="Sujet"
            name="subject"
            autocomplete="off"
            @blur="$v.formContact.subject.$touch"
          />
          <div v-if="$v.formContact.subject.$error" class="invalid-feedback">
            Merci de nous indiquer le sujet de ton message
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="inputTo">Destinataire *</label>
          <select
            id="inputTo"
            v-model="formContact.to"
            :class="{ 'is-invalid': $v.formContact.to.$error }"
            class="form-control"
            name="contact-to"
            required=""
            @blur="$v.formContact.to.$touch"
          >
            <option :value="null" selected>Choisir un destinataire</option>
            <option value="hello">Général (infos, suggestions, partenariats, chouquettisation, ...)</option>
            <option value="communication">Réseaux sociaux (Insta, Facebook)</option>
            <option value="webmaster">Webmaster (tout ce qui concerne le site)</option>
          </select>
          <div v-if="$v.formContact.to.$error" class="invalid-feedback">
            Merci de sélectionner un destinataire parmi la liste
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="message">Message *</label>
        <textarea
          id="message"
          v-model="formContact.message"
          :class="{ 'is-invalid': $v.formContact.message.$error }"
          class="form-control"
          rows="10"
          name="contact-content"
          required=""
          @blur="$v.formContact.message.$touch"
        ></textarea>
        <div v-if="$v.formContact.message.$error" class="invalid-feedback">
          Merci de nous laisser un message (avec un minimum de contenu)
        </div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-show="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
        Envoyer
      </button>
      <span class="float-right"><em>* champs obligatoires</em></span>
    </form>
  </div>
</template>

<script>
import { email, minLength, required } from 'vuelidate/lib/validators'
import _ from 'lodash'

const recipients = ['hello', 'communication', 'webmaster']
const mustMatchRecipients = (value) => {
  return !value || recipients.includes(value)
}

export default {
  data() {
    return {
      formContact: {
        name: null,
        email: null,
        subject: null,
        to: null,
        message: null
      },
      loading: false
    }
  },
  methods: {
    async postMessage() {
      this.$v.formContact.$touch()
      if (!this.$v.formContact.$invalid) {
        try {
          this.loading = true

          // Get recaptcha token
          await this.$recaptchaLoaded()
          // Execute reCAPTCHA with action "login".
          const token = await this.$recaptcha('contact')

          await this.$wpAPI.contact.postMessage({
            ...this.formContact,
            recaptcha: token
          })

          this.$store.dispatch('alerts/addAction', {
            type: 'success',
            message: 'Ton message nous est bien parvenu : merci :-). On te répondra dès que possible.'
          })

          // clear form
          this.formContact = _.mapValues(this.formContact, () => null)
          this.$v.formContact.$reset()

          this.$emit('done')
        } catch (err) {
          this.$store.dispatch('alerts/addAction', { type: 'danger', message: err })
        } finally {
          this.loading = false
        }
      }
    }
  },
  validations: {
    formContact: {
      name: {
        required
      },
      email: {
        required,
        email
      },
      subject: {
        required
      },
      to: {
        required,
        mustMatchRecipients
      },
      message: {
        required,
        minText: minLength(10)
      }
    }
  }
}
</script>

<style></style>