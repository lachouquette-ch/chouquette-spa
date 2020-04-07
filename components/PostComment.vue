<template>
  <article>
    <header>
      <div>
        <WpAvatar
          size="32"
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
    <section>
      <p v-html="comment.content.rendered"></p>
    </section>
    <section>
      <ul v-if="children" class="comment-children">
        <PostComment v-for="child in children" :key="child.id" :comment="child" :comments="comments" />
      </ul>
    </section>
  </article>
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

<style lang="scss" scoped>
.comment-metadata {
  color: $chouquette-grey;
  font-style: italic;
}

.comment-children {
  border-left: 2px solid $chouquette-darker-grey;
}
</style>
