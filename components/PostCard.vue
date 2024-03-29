<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-card
    class="d-flex"
    :class="{ vertical: vertical, horizontal: !vertical, large: large }"
    dense
    hover
    ripple
    flat
    :color="transparent ? 'transparent' : 'white'"
    v-bind="{ ...$props, ...$attrs }"
    :to="postLink"
    :nuxt="!disableLink"
    @click.prevent="$emit('click')"
  >
    <Media
      v-if="post.image"
      :media="post.image"
      :size="large ? 'medium_large' : 'medium'"
      class="rounded-lg flex-shrink-0 flex-grow-0"
      :class="{ 'rounded-r-0': !transparent }"
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
    </Media>

    <v-card-text class="pa-2 flex-grow-1">
      <p v-if="!vertical" class="secondary--text font-weight-bold text-lowercase mb-0">
        {{ getCategoryById(post.categoryId).name }}
      </p>
      <h3 class="text-h4 mt-1" :class="{ 'cq-three-line': !vertical && !large }">{{ post.title }}</h3>
      <p v-if="large && !hideMeta" class="mt-2 ma-0">le {{ postDate | fromISO }} par {{ post.authorName }}</p>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Media from '~/components/Media'

export default {
  components: { Media },
  props: {
    post: {
      required: true,
      type: Object,
    },
    hideMeta: Boolean,
    vertical: Boolean,
    large: Boolean,
    disableLink: Boolean,
    transparent: Boolean,
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
    postLink() {
      return this.disableLink ? null : `/${this.post.slug}`
    },
    postDate() {
      return this.post.modified ? this.post.modified : this.post.date
    },
  },
}
</script>

<style lang="scss" scoped>
.horizontal {
  height: 120px;

  &.large {
    height: 150px;
  }
}

.vertical {
  width: 150px;
  flex-direction: column;
  flex-shrink: 0;

  &.large {
    width: 250px;
  }
}
</style>
