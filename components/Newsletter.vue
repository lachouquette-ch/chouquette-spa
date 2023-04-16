<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-container fluid class="cq-yellow text-center pa-5 rounded-0">
    <div class="my-5">
      <h3 class="text-h2 mb-3 font-weight-black">Tu veux tout connaître du meilleur de chez toi ?</h3>
      <p class="mb-0">Reçois tous les jeudis une sélection des meilleures adresses et bons plans de ta région</p>

      <VueMailchimpSubscribe
        url="https://unechouquettealausanne.us8.list-manage.com/subscribe/post-json"
        :user-id="mailChimpUserId"
        :list-id="mailChimpListId"
        @error="onMailchimpSubscriptionError"
        @success="onMailchimpSubscriptionSuccess"
      >
        <template #default="{ subscribe, setEmail, loading }">
          <v-container class="cq-sm-max-width">
            <v-row class="justify-center align-center" no-gutters>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="email"
                  label="Ton email"
                  class="mr-md-3"
                  solo
                  rounded
                  hide-details
                  name="email"
                  type="email"
                  @blur="setEmail($event.target.value)"
                  autocomplete="email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn color="cq-blue" block x-large class="mt-2 mt-md-0" :loading="loading" @click="subscribe"
                  >Je m'inscris !</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </template>
      </VueMailchimpSubscribe>
    </div>
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
