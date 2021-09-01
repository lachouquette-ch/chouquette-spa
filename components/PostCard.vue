<template>
  <v-card class="d-flex" dense flat hover ripple max-width="400" :to="`/${post.slug}`" nuxt>
    <WpMediaNew
      v-if="post.image"
      :media="post.image"
      size="thumbnail"
      :width="large ? '150' : '100'"
      contain
      aspect-ratio="1"
      class="flex-grow-0 rounded"
    ></WpMediaNew>

    <v-card-text class="pa-0 px-2 flex-grow-1 overflow-hidden">
      <v-card-title class="pa-0">
        <h2 class="text-h6 text-break black--text" style="line-height: 1.5rem">{{ post.title }}</h2>
        <v-card-subtitle class="pa-0">
          <p class="text-uppercase ma-0">{{ getCategoryById(post.categoryId).name }}</p>
          <p class="ma-0">Le {{ post.date | fromISO }} par {{ post.authorName }}</p>
        </v-card-subtitle>
      </v-card-title>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import WpMediaNew from '~/components/WpMediaNew'

export default {
  components: { WpMediaNew },
  props: {
    post: {
      required: true,
      type: Object,
    },
    large: Boolean,
  },
  computed: {
    ...mapGetters('categories', {
      getCategoryById: 'getById',
    }),
  },
}
</script>

<style lang="scss" scoped></style>
