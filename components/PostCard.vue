<template>
  <v-card
    class="d-flex"
    :class="{ vertical: vertical, horizontal: !vertical, large: large }"
    dense
    flat
    tile
    hover
    ripple
    v-bind="{ ...$props, ...$attrs }"
    @click.prevent="$emit('click')"
  >
    <WpMediaNew
      v-if="post.image"
      :media="post.image"
      :size="large ? 'medium_large' : 'medium'"
      class="rounded-lg flex-shrink-0 flex-grow-0"
      :aspect-ratio="imgAspectRatio"
      :width="imgWidth"
      :max-width="!vertical ? '50%' : 'auto'"
      position="center top"
    >
      <v-card-subtitle v-if="vertical" class="pa-2">
        <v-chip color="white" small>
          {{ getCategoryById(post.categoryId).name }}
        </v-chip>
      </v-card-subtitle>
      <v-card-subtitle v-else-if="post.isTop" class="pa-2">
        <v-chip color="white" small>
          Top
          <v-icon right>mdi-trophy-outline</v-icon>
        </v-chip>
      </v-card-subtitle>
    </WpMediaNew>

    <v-card-text class="pa-0 px-2 flex-grow-1">
      <p v-if="!vertical" class="secondary--text text-lowercase mb-0">{{ getCategoryById(post.categoryId).name }}</p>
      <h3 class="text-h4 mt-1" :class="{ 'cq-three-line': !vertical && !large }">{{ post.title }}</h3>
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
    imgAspectRatio() {
      if (this.vertical) return '1'
      else return this.large ? '1' : '3 / 2'
    },
    imgWidth() {
      if (this.vertical) return '100%'
      else return this.large ? '200px' : '150px'
    },
  },
}
</script>

<style lang="scss" scoped>
.horizontal {
  height: 100px;

  &.large {
    height: 150px;
  }
}

.vertical {
  width: 150px;
  flex-direction: column;
  flex-shrink: 0;

  &.large {
    width: 200px;
  }
}
</style>
