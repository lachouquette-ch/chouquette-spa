<template>
  <div>
    <v-dialog v-model="replyDialog" max-width="500">
      <PostCommentReply :post="post" :parent="comment.id" @done="toggleReplyToComment" />
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
        <v-btn text class="text-decoration-underline" @click.prevent="replyDialog = true">{{ replyLinkText }}</v-btn>
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
      return this.comments.filter(({ parentId }) => parentId === parseInt(this.comment.id))
    },
    commentDate() {
      return moment(this.comment.date).locale('fr-CH').format('dddd DD MMMM YYYY à k:mm')
    },
    replyLinkText() {
      return this.replyToComment ? 'Cacher ma réponse à ce commentaire' : 'Répondre à ce commentaire'
    },
  },
  methods: {
    toggleReplyToComment() {
      this.replyToComment = !this.replyToComment
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
