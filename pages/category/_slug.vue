<template>
  <div class="category-page layout-content">
    <div class="fiches">
      <div class="container my-4">
        <h1 class="text-center mb-4">{{ category.name }}</h1>
        <div class="h3">Ma recherche</div>
        <div class="d-flex justify-content-around flex-wrap my-4">
          <Fiche v-for="fiche in fiches" :key="fiche.id" :fiche="fiche" :responsive="false" class="mx-2 mb-3" />
        </div>
      </div>
    </div>

    <div class="map" :class="{ 'hide-map': !isMapShown }">
      <div ref="map" class="h-100 w-100" />
    </div>

    <div class="toggle-buttons d-md-none btn-group btn-group-toggle" data-toggle="buttons">
      <label
        class="btn btn-sm btn-primary border-white border-right-0"
        :class="{ active: !isMapShown }"
        @click="isMapShown = false"
      >
        <input id="showFiche" type="radio" name="options" :checked="!isMapShown" />Fiches
      </label>
      <label
        class="btn btn-sm btn-primary border-white border-left-0"
        :class="{ active: isMapShown }"
        @click="isMapShown = true"
      >
        <input id="showMap" type="radio" name="options" :checked="isMapShown" />Cartes
      </label>
    </div>
  </div>
</template>

<script>
import Fiche from '~/components/Fiche'
import { MAP_OPTIONS } from '~/constants/mapSettings'
export default {
  components: { Fiche },
  async asyncData({ store, params }) {
    const category = await store.dispatch('categories/fetchBySlug', params.slug)
    const subCategories = store.state.categories.children[category.id] // fetched along category

    const subCategoryIds = subCategories.map(({ id }) => id)
    const ficheResult = await store.dispatch('fiches/fetchByCategoryIds', {
      categoryIds: [category.id, ...subCategoryIds]
    })

    return {
      category,
      fiches: ficheResult.fiches,
      fichesTotal: ficheResult.total,
      fichesPages: ficheResult.pages,
      fichesNextPage: 2,
      fichesLoading: false
    }
  },
  data() {
    return {
      map: null,
      isMapShown: false
    }
  },
  created() {
    this.$store.dispatch('menus/setSelectedCategory', this.category)
  },
  async mounted() {
    try {
      this.google = await this.$googleMaps
      this.map = new this.google.maps.Map(this.$refs.map, {
        ...MAP_OPTIONS,
        gestureHandling: 'none',
        zoomControl: false
      })
    } catch (err) {
      if (err instanceof Error) console.error(err)
      else throw err
    }
  }
}
</script>

<style lang="scss" scoped>
.fiches {
  @include media-breakpoint-up(md) {
    margin-right: 50vw;
  }
}

.map {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: $zindex-sticky;
  height: calc(100vh - #{$header-height} - #{$covid-banner-height});

  @include media-breakpoint-up(md) {
    width: 50vw;
  }
}

.hide-map {
  @include media-breakpoint-down(sm) {
    visibility: hidden;
  }
}

.toggle-buttons {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: $zindex-sticky + 1;
}
</style>
