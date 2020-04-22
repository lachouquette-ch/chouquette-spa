<template>
  <article class="post-card post-card-chouquettise">
    <nuxt-link :to="{ path: `/${post.slug}` }" :title="post.title.rendered | heDecode" class="text-decoration-none">
      <div class="post-card-picture" :style="postCardBackground">
        <CategoryLogo
          v-if="topCategory"
          :category="topCategory"
          color="black"
          class="rounded-circle float-left post-card-category"
          @init="dispatchInit"
        />
      </div>
      <div class="post-card-caption d-flex text-center justify-content-center align-items-center">
        {{ post.title.rendered | heDecode }}
      </div>
    </nuxt-link>
  </article>
</template>

<script>
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
      featuredMedia: null,
      categoryLogoInit: false
    }
  },
  computed: {
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
    if (this.post.featured_media)
      this.featuredMedia = await this.$store.dispatch('media/fetchById', this.post.featured_media)
  },
  methods: {
    /**
     * Wait for all async data before emitting init event
     *
     * @returns {Promise<void>}
     */
    async dispatchInit() {
      await Promise.all([this.topCategory, this.featuredMedia])
      this.$emit('init')
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
  box-shadow: $box-shadow;

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
  box-shadow: $box-shadow;
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
