<template>
  <form class="comment-form" @submit.prevent="postComment">
    <div class="form-group">
      <label :for="`comment${_uid}`">Commentaire *</label>
      <textarea
        :id="`comment${_uid}`"
        v-model="formComment.comment"
        class="form-control"
        :class="{ 'is-invalid': $v.formComment.comment.$error }"
        rows="5"
        aria-required="true"
        @blur="$v.formComment.comment.$touch"
      ></textarea>
      <div v-if="!$v.formComment.comment.required" class="invalid-feedback">
        Il faut un contenu à ton commentaire
      </div>
      <div v-if="!$v.formComment.comment.minText" class="invalid-feedback">
        Ton commentaire doit avoir un minimum de contenu
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-4 col-form-label" :for="`author${_uid}`">Nom *</label>
      <div class="col-sm-8">
        <input
          :id="`author${_uid}`"
          v-model.trim="formComment.name"
          name="name"
          class="form-control"
          :class="{ 'is-invalid': $v.formComment.name.$error }"
          type="text"
          aria-required="true"
          @blur="$v.formComment.name.$touch"
        />
        <div v-if="!$v.formComment.name.required" class="invalid-feedback">
          Merci de nous indiquer ton ptit nom
        </div>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-sm-4">
        <label class="col-form-label" :for="`email${_uid}`">Adresse de messagerie *</label>
        <small class="form-text text-muted">
          Ton email ne sera pas publié. Parole de Chouquette !
        </small>
      </div>
      <div class="col-sm-8">
        <input
          :id="`email${_uid}`"
          v-model.trim="formComment.email"
          class="form-control"
          :class="{ 'is-invalid': $v.formComment.email.$error }"
          type="email"
          name="email"
          aria-required="true"
          @blur="$v.formComment.email.$touch"
        />
        <div v-if="!$v.formComment.email.required" class="invalid-feedback">
          Merci de nous indiquer ton ptit nom
        </div>
        <div v-if="!$v.formComment.email.email" class="invalid-feedback">
          Ton email doit être valide
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-4 col-form-label" :for="`url${_uid}`">Site web</label>
      <div class="col-sm-8">
        <input
          :id="`url${_uid}`"
          v-model.trim="formComment.webSite"
          class="form-control"
          :class="{ 'is-invalid': $v.formComment.webSite.$error }"
          name="url"
          type="text"
          value=""
          size="30"
          @blur="$v.formComment.webSite.$touch"
        />
        <div v-if="!$v.formComment.webSite.url" class="invalid-feedback">
          Ton Site web doit être une adresse valide
        </div>
      </div>
    </div>
    <div class="form-submit">
      <button class="btn btn-primary" type="submit" :disabled="loading">
        <b-spinner v-show="loading" small variant="yellow" label="chargement" class="mr-2"></b-spinner>
        Poster mon commentaire
      </button>
    </div>
  </form>
</template>

<script>
import { required, email, url, minLength } from 'vuelidate/lib/validators'

export default {
  props: {
    post: {
      type: Number,
      required: true,
    },
    parent: {
      type: Number,
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
        minText: minLength(10),
      },
    },
  },
}
</script>

<style scoped></style>
