<template>
  <v-card flat rounded="0">
    <v-img src="/positive-project_full.png" height="400" position="top center" class="cq-md-max-width mx-auto">
      <div class="content d-flex flex-column px-5 pb-5">
        <p class="text-h1 primary--text font-weight-black mt-auto">
          Lance-toi dès aujourd'hui dans une démarche durable !
        </p>
        <v-btn elevation="3" color="cq-blue" class="black--text inline-block" x-large link="https://www.google.com"
          >Je fais un diagnostic gratuit</v-btn
        >
      </div>
    </v-img>
  </v-card>
</template>

<script>
</script>

<style lang="scss" scoped>
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
