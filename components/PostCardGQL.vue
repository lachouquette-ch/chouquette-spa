<template>
  <article class="card shadow-sm position-relative text-black">
    <div class="card-img-top">
      <WpMedia v-if="post.image" :media="post.image" size="medium_large" />
      <div class="card-category rounded-circle bg-white shadow">
        <WpMediaCategory v-if="topCategory" :category="topCategory" width="35" height="35" color="black" />
      </div>
    </div>
    <div class="card-body">
      <p class="card-text text-center">
        {{ post.title }}
      </p>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex'
import WpMediaCategory from './WpMediaCategory'
import WpMedia from '~/components/WpMediaGQL'

export default {
  components: { WpMedia, WpMediaCategory },
  props: {
    post: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      topCategory: null,
      featuredMedia: null,
    }
  },
  computed: {
    ...mapState({
      categories: (state) => state.categories.all,
      media: (state) => state.media.all,
    }),
  },
  created() {
    this.topCategory = this.categories[this.post.category]
  },
}
</script>

<style lang="scss" scoped>
.card {
  width: 300px;
  max-width: 100%;

  @include hover-focus {
    box-shadow: $box-shadow !important;
  }
}

.card-img-top {
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative;

  > img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    width: 100%;
    height: 100%;
    object-fit: cover;

    border: 15px solid $white;
  }
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

.card-body {
  padding: 0 10px 5px 10px;
}

.card-text {
  font-family: $font-family-heading;
  font-size: $h5-font-size;

  min-height: $line-height-base * 3rem;
}
</style>
