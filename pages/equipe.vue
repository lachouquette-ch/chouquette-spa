<template>
  <WpPage :page="page">
    <template #footer>
      <template v-if="$fetchState.pending">
        <b-spinner variant="yellow" label="chargement" class="text-center my-3"></b-spinner>
      </template>
      <template v-else>
        <div class="my-3">
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
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p class="card-text" v-html="member.description" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </WpPage>
</template>

<script>
import WpAvatar from '../components/WpAvatar'
import WpPage from '~/components/WpPage'

export default {
  components: {
    WpPage,
    WpAvatar,
  },
  async fetch() {
    this.team = await this.$wpAPI.wp.users.getTeam().then(({ data }) => data)
  },
  async asyncData({ app }) {
    return {
      page: await app.$wpAPI.wp.pages.getBySlug('equipe').then(({ data }) => data[0]),
    }
  },
  data() {
    return {
      team: [],
    }
  },
}
</script>

<style lang="scss" scoped>
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
