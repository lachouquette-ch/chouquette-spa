<template>
  <form class="comment-form" @submit.prevent="postComment">
    <p class="comment-notes">Ton email ne sera pas publié. Les champs obligatoires sont indiqués avec *</p>
    <div class="form-group">
      <label for="comment">Commentaire *</label>
      <textarea
        id="comment"
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
      <label class="col-sm-4 col-form-label" for="author">Nom *</label>
      <div class="col-sm-8">
        <input
          id="author"
          v-model.trim="formComment.name"
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
      <label class="col-sm-4 col-form-label" for="email">Adresse de messagerie *</label>
      <div class="col-sm-8">
        <input
          id="email"
          v-model.trim="formComment.email"
          class="form-control"
          :class="{ 'is-invalid': $v.formComment.email.$error }"
          type="email"
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
      <label class="col-sm-4 col-form-label" for="url">Site web</label>
      <div class="col-sm-8">
        <input
          id="url"
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
        <span v-show="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
        Poster mon commentaire
      </button>
    </div>
  </form>
</template>

<script>
import { required, email, url, minLength } from 'vuelidate/lib/validators'
import CommentAPI from '../api/wordpress/comments'

export default {
  props: {
    post: {
      type: Object,
      required: true
    },
    parent: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formComment: {
        name: null,
        email: null,
        webSite: null,
        comment: null
      },
      loading: false
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

        CommentAPI.postComment({
          post: this.post.id,
          parent: this.parent ? this.parent.id : null,
          author_name: this.formComment.name,
          author_email: this.formComment.email,
          content: this.formComment.comment,
          recaptcha: token
        })
          .then((result) =>
            this.$store.dispatch('alerts/addAction', {
              type: 'success',
              message:
                'Ton commentaire nous est bien parvenu : merci :-). Il sera visible dès validation de notre part.'
            })
          )
          .catch((error) =>
            this.$store.dispatch('alerts/addAction', { type: 'danger', message: error.response.data.message })
          )
          .finally(() => (this.loading = false))
      }
    }
  },
  validations: {
    formComment: {
      name: {
        required
      },
      email: {
        required,
        email
      },
      webSite: {
        url
      },
      comment: {
        required,
        minText: minLength(10)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
