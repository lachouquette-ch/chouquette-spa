<template>
  <article class="card shadow position-relative d-inline">
    <div>
      <WpMedia v-if="featuredMedia" :media="featuredMedia" size="medium_large" class="card-img-top"></WpMedia>
      <div class="card-category rounded-circle bg-white shadow">
        <CategoryLogo v-if="topCategory" :category="topCategory" width="35" height="35" color="black" @init="dispatchInit" />
      </div>
    </div>
    <div class="card-body">
      <p class="card-text text-center">
        {{ post.title.rendered | heDecode }}
      </p>
    </div>
  </article>
</template>

<script>
import CategoryLogo from './CategoryLogo'
import WpMedia from '~/components/WpMedia'

export default {
  components: { WpMedia, CategoryLogo },
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
.card {
  width: 300px !important;
  max-width: 100%;

  font-family: $font-family-heading;
  font-size: $h5-font-size;
}

.card-img-top {
  height: 300px;
  object-fit: cover;
}

.card-chouquettise {
  .card-category {
    background-color: $chouquette-yellow;
  }
}

.card-category {
  padding: 0.75rem;

  position: absolute;
  top: 5px;
  left: 5px;

  transform: rotate(-5deg);
}

.card-img-top {
  border: 15px solid $white;
}

.card-text {
  min-height: $line-height-base * 3rem;
}
</style>
