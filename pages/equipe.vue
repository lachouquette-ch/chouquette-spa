<template>
  <div class="equipe-page container layout-content my-4">
    <div v-if="page" class="row">
      <div class="col gutenberg-content">
        <h1 class="text-center mb-4">{{ page.title.rendered | heDecode }}</h1>
        <div v-html="page.content.rendered" />
      </div>
    </div>
    <div v-if="team" class="my-3">
      <h2 class="text-center mb-4">L'équipe</h2>
      <div class="d-flex flex-wrap justify-content-around">
        <div v-for="member in team" :key="member.id" class="card mr-3 mb-4">
          <WpAvatar
            :size="150"
            :avatar-urls="member.avatar_urls"
            :alt="member.name"
            class="card-img-top mx-auto mt-3 rounded-circle"
          />
          <div class="card-body text-center">
            <h3 class="card-title">{{ member.name }}</h3>
            <p class="card-text small text-muted">{{ member.title }}</p>
            <p class="card-text" v-html="member.description" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WpAvatar from '../components/WpAvatar'

export default {
  components: {
    WpAvatar
  },
  data() {
    return {
      page: null,
      team: null
    }
  },
  async mounted() {
    this.page = await this.$wpAPI.wp.pages.getBySlug('equipe')
    this.team = await this.$wpAPI.wp.users.getTeam()
  },
  head() {
    return {
      link: [{ rel: 'stylesheet', href: `${process.env.wpBaseUrl}/wp-includes/css/dist/block-library/style.min.css` }]
    }
  }
}
</script>

<style lang="scss">
.card {
  max-width: 300px;

  @include hover-focus {
    box-shadow: $box-shadow !important;
  }
}

.card-img-top {
  width: fit-content;
}

.card-title {
  font-family: $font-family-heading;
}
</style>
