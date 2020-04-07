<template>
  <li class="comment odd alt thread-odd thread-alt depth-1 parent">
    <article id="div-comment-12534" class="comment-body">
      <footer class="comment-meta">
        <div class="comment-author">
          <WpAvatar
            size="32"
            :avatar-urls="comment.author_avatar_urls"
            :alt="comment.author_name"
            class="avatar avatar-32 photo rounded-circle"
          />
          <b class="fn">{{ comment.author_name }}</b> <span class="says">dit&nbsp;:</span>
        </div>
        <div class="comment-metadata">
          <time :datetime="comment.date">Le {{ commentDate }}</time>
        </div>
      </footer>
      <div class="comment-content">
        <p v-html="comment.content.rendered"></p>
      </div>
    </article>
    <ul v-if="children" class="children">
      <PostComment v-for="child in children" :key="child.id" :comment="child" :comments="comments" />
    </ul>
  </li>
</template>

<script>
import moment from 'moment'
import WpAvatar from './WpAvatar'

export default {
  name: 'PostComment',
  components: { WpAvatar },
  props: {
    comment: {
      type: Object,
      required: true
    },
    comments: {
      type: Array,
      required: true
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
    }
  }
}
</script>

<style scoped></style>
