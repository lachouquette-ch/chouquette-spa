<template>
  <article class="post-card post-card-chouquettise">
    <nuxt-link :to="{ path: `/${post.slug}` }" :title="escapedTitle" class="text-decoration-none">
      <div class="post-card-picture" :style="postCardBackground">
        <div class="rounded-circle float-left post-card-category">
          <CategoryLogo v-if="topCategory" :category="topCategory" color="black" />
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
import CategoryLogo from './CategoryLogo'

export default {
  components: { CategoryLogo },
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      topCategory: null,
      featuredMedia: null
    }
  },
  computed: {
    escapedTitle() {
      return he.decode(this.post.title.rendered)
    },
    postCardBackground() {
      if (this.featuredMedia) {
        return {
          'background-image': `url('${this.featuredMedia.media_details.sizes.medium.source_url}')`
        }
      } else {
        return {}
      }
    }
  },
  async created() {
    this.topCategory = await this.$store.dispatch('categories/fetchById', this.post.top_categories[0])
    this.featuredMedia = await this.$store.dispatch('media/fetchById', this.post.featured_media)
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
