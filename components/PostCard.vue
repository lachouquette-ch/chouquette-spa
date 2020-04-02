<template>
  <article class="post-card post-card-chouquettise">
    <nuxt-link :to="{ path: `/${post.slug}` }" :title="escapedTitle" class="text-decoration-none">
      <div class="post-card-picture" :style="`background-image: url('${post.featured_img}')`">
        <div class="rounded-circle float-left post-card-category">
          <img
            src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
            alt="Mode, déco, épicerie, web"
            title="Shopping"
            class=""
          />
        </div>
      </div>
      <div class="post-card-caption d-flex text-center justify-content-center align-items-center">
        {{ escapedTitle }}
      </div>
    </nuxt-link>
  </article>
</template>

<script>
import he from 'he'

export default {
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  computed: {
    escapedTitle() {
      return he.decode(this.post.title.rendered)
    }
  }
}
</script>

<style lang="scss" scoped>
.post-card {
  display: inline-block;
  position: relative;
  width: 300px;
  max-width: 100%;

  font-family: $font-family-heading;
  font-size: $h5-font-size;

  background-color: $white;
  box-shadow: 0 4px 6px rgba($black, 0.3);

  > a {
    color: $black;
    @include hover-focus-active {
      color: $black;
    }
  }

  transition: 0.3s;
}

.post-card-chouquettise {
  .post-card-category {
    background-color: $chouquette-yellow;
  }
}

.post-card-category {
  background-color: $white;
  box-shadow: -1px -1px 3px rgba($black, 0.3);
  padding: 0.75rem;

  position: absolute;
  top: 5px;
  left: 5px;

  transform: rotate(-5deg);

  > img {
    width: 35px;
  }
}

.post-card-picture {
  border: 15px solid $white;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.post-card-picture:after {
  content: '';
  display: block;
  padding-bottom: 100%;
}

.post-card-caption {
  margin: 0 10px 5px 10px;
  min-height: $line-height-base * 3rem;
}
</style>
