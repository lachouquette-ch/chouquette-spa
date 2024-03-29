<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <v-dialog v-model="replyDialog" max-width="500">
      <PostCommentReply :post="post" :parent="comment.id" @close="replyDialog = false" />
    </v-dialog>

    <article class="my-3">
      <header>
        <div>
          <img
            v-if="comment.authorAvatar"
            :alt="comment.authorName"
            :src="comment.authorAvatar"
            class="rounded-circle"
            height="32"
            width="32"
          />
          <b class="mx-2">{{ comment.authorName }}</b> <span class="says">dit&nbsp;:</span>
        </div>
        <div class="comment-metadata">
          <time :datetime="comment.date">Le {{ commentDate }}</time>
        </div>
      </header>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <section class="comment-content" v-html="comment.content" />
      <section v-if="!noReply">
        <v-btn text class="text-decoration-underline" @click.prevent="replyDialog = true"
          >Répondre à ce commentaire</v-btn
        >
      </section>
      <section>
        <ul v-if="children" class="comment-children">
          <PostComment v-for="child in children" :key="child.id" :post="post" :comment="child" :comments="comments" />
        </ul>
      </section>
    </article>
  </div>
</template>

<script>
import moment from 'moment'
import PostCommentReply from './PostCommentReply'

export default {
  name: 'PostComment',
  components: { PostCommentReply },
  props: {
    post: {
      type: String,
      required: true,
    },
    comment: {
      type: Object,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
    },
    noReply: Boolean,
  },
  data() {
    return {
      replyDialog: false,
    }
  },
  computed: {
    children() {
      return this.comments.filter(({ parentId }) => parseInt(parentId) === parseInt(this.comment.id))
    },
    commentDate() {
      return moment(this.comment.date).locale('fr-CH').format('dddd DD MMMM YYYY à k:mm')
    },
  },
}
</script>

<style lang="scss" scoped>
.comment-metadata {
  color: var(--v-cq-grey-base);
  font-style: italic;
}

.comment-children {
  border-left: 2px solid var(--v-cq-grey-light-base);
}

ul {
  padding-left: 10px;
}

::v-deep .comment-content {
  > p {
    margin-bottom: 0.25rem;
  }
}
</style>
