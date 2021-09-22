<template>
  <v-container fluid class="cq-yellow text-center pa-5 rounded-0">
    <h3 class="text-h2 mb-3">Tu veux tout connaître du meilleur de chez toi ?</h3>
    <p>Reçois une fois par semaine une sélection des meilleures adresses et bons plans de ta région</p>

    <VueMailchimpSubscribe
      url="https://unechouquettealausanne.us8.list-manage.com/subscribe/post-json"
      :user-id="mailChimpUserId"
      :list-id="mailChimpListId"
      @error="onMailchimpSubscriptionError"
      @success="onMailchimpSubscriptionSuccess"
    >
      <template #default="{ subscribe, setEmail, loading }">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="email"
              label="Ton email"
              solo
              rounded
              hide-details
              name="email"
              type="email"
              @blur="setEmail($event.target.value)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn color="primary" block x-large class="mt-2" :loading="loading" @click="subscribe"
              >Je m'inscris !</v-btn
            >
          </v-col>
        </v-row>
      </template>
    </VueMailchimpSubscribe>
  </v-container>
</template>

<script>
import VueMailchimpSubscribe from 'vue-mailchimp-subscribe/dist/vue-mailchimp-subscribe'
import newsletter from '~/mixins/newsletter'

export default {
  components: { VueMailchimpSubscribe },
  mixins: [newsletter],
  data() {
    return {
      email: null,
    }
  },
}
</script>

<style lang="scss" scoped></style>
