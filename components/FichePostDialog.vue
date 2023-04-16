<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-dialog
    v-model="dialog"
    color="white"
    scrollable
    transition="slide-x-reverse-transition"
    v-bind="{ ...$props, ...$attrs }"
    @close="close"
    @click:outside="close"
  >
    <v-card tile>
      <v-card-title>
        <PostShare v-if="isPost" :post="ficheOrPost" small color="primary">Partager</PostShare>
        <FicheShare v-else-if="isFiche" :fiche="ficheOrPost" small color="primary">Partager</FicheShare>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text ref="content" class="pa-0">
        <Post v-if="isPost" :post="ficheOrPost"></Post>
        <Fiche v-else-if="isFiche" :fiche="ficheOrPost" class="pa-2" dialog></Fiche>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash'
import FicheShare from '~/components/FicheShare'
import PostShare from '~/components/PostShare'
import Post from '~/components/Post'
import Fiche from '~/components/Fiche'
import graphql from '~/mixins/graphql'

export default {
  components: { Post, PostShare, Fiche, FicheShare },
  mixins: [graphql],
  props: {
    value: Boolean,
    ficheOrPost: {
      type: Object,
      validator(value) {
        return _.isNull(value) || _.includes(['Post', 'Fiche'], value.__typename)
      },
    },
    replaceUrl: Boolean,
  },
  data() {
    return {
      dialog: false,
      previousURL: null,
    }
  },
  computed: {
    isPost() {
      return this.ficheOrPost && this.ficheOrPost.__typename === 'Post'
    },
    isFiche() {
      return this.ficheOrPost && this.ficheOrPost.__typename === 'Fiche'
    },
  },
  watch: {
    value(val) {
      this.dialog = val
      if (this.dialog) {
        if (this.replaceUrl) {
          this.previousURL = location.href
          history.replaceState(
            null,
            null,
            this.isPost ? `/${this.ficheOrPost.slug}` : `/fiche/${this.ficheOrPost.slug}`
          )
        }
        // scroll top
        this.$nextTick(() => {
          this.$refs.content.scrollTop = 0
        })
      }
    },
  },
  methods: {
    close() {
      if (this.replaceUrl) {
        history.replaceState(null, null, this.previousURL)
      }
      this.dialog = false
      this.$emit('input', false)
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped></style>
