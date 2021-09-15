<template>
  <v-card
    class="d-flex"
    :class="{ 'flex-column': vertical }"
    dense
    flat
    tile
    hover
    ripple
    :to="`/${post.slug}`"
    nuxt
    v-bind="{ ...$props, ...$attrs }"
    :width="componentWidth"
  >
    <WpMediaNew
      v-if="post.image"
      :media="post.image"
      :size="large ? 'medium_large' : 'thumbnail'"
      class="rounded-xl flex-shrink-0 flex-grow-0"
      :width="large ? 300 : 150"
      :height="large ? 300 : 150"
    >
      <v-card-subtitle v-if="vertical" class="pa-2">
        <v-chip color="white" small>
          {{ getCategoryById(post.categoryId).name }}
        </v-chip>
      </v-card-subtitle>
    </WpMediaNew>

    <v-card-text class="pa-0 px-2 flex-grow-1 overflow-hidden">
      <p v-if="!vertical" class="secondary--text text-lowercase mb-0">{{ getCategoryById(post.categoryId).name }}</p>
      <h3 :class="{ 'text-h6': vertical }" class="mt-1">{{ post.title }}</h3>
      <p v-if="large && !hideMeta" class="ma-0">Le {{ post.date | fromISO }} par {{ post.authorName }}</p>
    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import WpMediaNew from '~/components/WpMediaNew'

export default {
  components: { WpMediaNew },
  props: {
    post: {
      required: true,
      type: Object,
    },
    hideMeta: Boolean,
    vertical: Boolean,
    large: Boolean,
  },
  computed: {
    ...mapGetters('categories', {
      getCategoryById: 'getById',
    }),
    componentWidth() {
      if (!this.vertical) return '100%'
      return this.large ? 300 : 150
    },
  },
}
</script>

<style lang="scss" scoped></style>
