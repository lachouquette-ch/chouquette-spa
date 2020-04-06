<template>
  <li class="comment odd alt thread-odd thread-alt depth-1 parent">
    <article id="div-comment-12534" class="comment-body">
      <footer class="comment-meta">
        <div class="comment-author rounded-circle">
          <img alt="" :src="comment.author_avatar_urls['24']" class="avatar avatar-32 photo" height="32" width="32" />
          <b class="fn">{{ comment.author_name }}</b> <span class="says">dit&nbsp;:</span>
        </div>
        <div class="comment-metadata">
          <time :datetime="comment.date">{{ comment.date }}</time>
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
export default {
  name: 'PostComment',
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
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  @extend .link-secondary !optional;
}

// no list bullets
ol,
ul {
  list-style-type: none;
}

.comment-list {
  padding: 0;
}

.comment {
  margin-bottom: 0.5rem;
}

.comment-body {
  margin-bottom: 1rem;
}

.comment-meta {
  .comment-author {
    img {
      @extend .rounded-circle !optional;
      margin-right: 0.5rem;
    }
  }

  .comment-metadata {
    a {
      text-decoration: none;
    }
  }

  .comment-content {
    margin-top: 0.5rem;

    > p {
      margin: 0;
    }
  }
}
</style>
