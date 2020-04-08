<template>
  <article class="my-3">
    <header>
      <div>
        <WpAvatar
          :size="32"
          :avatar-urls="comment.author_avatar_urls"
          :alt="comment.author_name"
          class="rounded-circle"
        />
        <b class="ml-2">{{ comment.author_name }}</b> <span class="says">dit&nbsp;:</span>
      </div>
      <div class="comment-metadata">
        <time :datetime="comment.date">Le {{ commentDate }}</time>
      </div>
    </header>
    <section class="comment-content" v-html="comment.content.rendered" />
    <section>
      <a href="" class="text-chouquette-grey" @click.prevent="toggleReplyToComment">{{ replyLinkText }}</a>
      <PostCommentReply
        v-show="replyToComment"
        :post="post"
        :parent="comment.id"
        class="border border-chouquette-light rounded p-3 mt-2"
        @done="toggleReplyToComment"
      />
    </section>
    <section>
      <ul v-if="children" class="comment-children">
        <PostComment v-for="child in children" :key="child.id" :post="post" :comment="child" :comments="comments" />
      </ul>
    </section>
  </article>
</template>

<script>
import moment from 'moment'
import WpAvatar from './WpAvatar'
import PostCommentReply from './PostCommentReply'

export default {
  name: 'PostComment',
  components: { PostCommentReply, WpAvatar },
  props: {
    post: {
      type: Number,
      required: true
    },
    comment: {
      type: Object,
      required: true
    },
    comments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      replyToComment: false
    }
  },
  computed: {
    children() {
      return this.comments.filter(({ parent }) => parent === this.comment.id)
    },
    commentDate() {
      return moment(this.comment.date)
        .locale('fr-CH')
        .format('dddd DD MMMM YYYY à k:mm')
    },
    replyLinkText() {
      return this.replyToComment ? 'Cacher ma réponse à ce commentaire' : 'Répondre à ce commentaire'
    }
  },
  methods: {
    toggleReplyToComment() {
      this.replyToComment = !this.replyToComment
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-metadata {
  color: $chouquette-grey;
  font-style: italic;
}

.comment-children {
  border-left: 2px solid $chouquette-darker-grey;
}

::v-deep .comment-content {
  > p {
    margin-bottom: 0.25rem;
  }
}
</style>
