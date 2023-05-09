<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-card flat rounded="0">
    <v-img src="/positive-project_bg.png" position="top center" class="cq-md-max-width mx-auto" max-height="500px">
      <v-img class="logo" src="/positive-project_logo.png" contain></v-img>
      <div class="content d-flex flex-column px-5 pb-5">
        <p class="text-md-h1 primary--text font-weight-black mt-auto">
          Lance-toi dès aujourd'hui dans une démarche durable !
        </p>
        <v-btn
          elevation="3"
          color="cq-blue"
          class="black--text inline-block"
          :x-large="$vuetify.breakpoint.mdAndUp"
          href="https://thepositiveproject.eco/"
          target="_blank"
          >Je fais un diagnostic gratuit</v-btn
        >
      </div>
    </v-img>
  </v-card>
</template>

<script>
</script>

<style lang="scss" scoped>
.logo {
  position: absolute;
  width: 220px;
  top: 5px;
  right: 5px;

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    width: 500px;
    top: 40px;
    right: 10px;
  }
}
.content {
  position: absolute;
  bottom: 0;
  text-align: center;

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    width: 50%;
    right: 0;
    text-align: left;
  }
}
</style>
