<template>
  <div class="newsletter container-fluid text-center">
    <div class="row">
      <div class="col-md-6 m-md-auto mb-3">
        <h3 class="newsletter-header w-75 m-auto">Tu veux tout connaître du meilleur de chez toi ?</h3>
      </div>
      <div class="col-md-6">
        <p class="mb-1 h3">Rejoins notre newsletter</p>
        <p class="text-muted">Nos derniers articles, bons plans et bien plus encore...</p>
        <VueMailchimpSubscribe
          url="https://unechouquettealausanne.us8.list-manage.com/subscribe/post-json"
          :user-id="mailChimpUserId"
          :list-id="mailChimpListId"
          @error="onMailchimpSubscriptionError"
          @success="onMailchimpSubscriptionSuccess"
        >
          <template #default="{ subscribe, setEmail, loading }">
            <form class="form-inline mx-auto justify-content-center" @submit.prevent="subscribe">
              <div class="form-row w-100">
                <div class="col-lg-8 mb-2">
                  <input
                    ref="mailRegistration"
                    type="email"
                    name="email"
                    placeholder="Ton email"
                    class="required email form-control w-100"
                    @input="setEmail($event.target.value)"
                  />
                </div>
                <div class="col-lg-4">
                  <button type="submit" name="subscribe" class="btn btn-dark-grey w-100" :disabled="loading">
                    <b-spinner v-show="loading" small variant="yellow" label="chargement" class="mr-2"></b-spinner>
                    Je m'inscris !
                  </button>
                </div>
              </div>
            </form>
          </template>
        </VueMailchimpSubscribe>
      </div>
    </div>
  </div>
</template>

<script>
import VueMailchimpSubscribe from 'vue-mailchimp-subscribe/dist/vue-mailchimp-subscribe'
import newsletter from '~/mixins/newsletter'

export default {
  components: { VueMailchimpSubscribe },
  mixins: [newsletter],
}
</script>

<style lang="scss" scoped>
.newsletter {
  padding: 1rem;
  background-color: $chouquette-yellow;

  @include media-breakpoint-up(md) {
    padding: 4rem 3rem;

    input {
      // .form-control-lg
      //height: $input-height-lg;
      //padding: $input-padding-y-lg $input-padding-x-lg;
      //@include font-size($input-font-size-lg);
      //line-height: $input-line-height-lg;
      //@include border-radius($input-border-radius-lg);
    }

    button {
      // .btn-lg
      //@include button-size(
      //$btn-padding-y-lg,
      //$btn-padding-x-lg,
      //$btn-font-size-lg,
      //$btn-line-height-lg,
      //$btn-border-radius-lg
      //);
    }
  }

  @include media-breakpoint-up(xl) {
    padding: 4rem 6rem;
  }

  h3 {
    font-family: $font-family-heading;
    line-height: 2.5rem;
  }
}

.newsletter-header {
  font-size: 1.75rem;
}
</style>
