<template>
  <div class="container layout-content">
    <div class="my-3">
      <b-form-group label="Recherche dans">
        <b-form-radio v-model="searchType" name="Fiches" value="fiche">Fiches</b-form-radio>
        <b-form-radio v-model="searchType" name="Articles" value="post">Articles</b-form-radio>
      </b-form-group>
      <b-form-group>
        <b-form-input v-model="searchText" type="search" debounce="500" placeholder="Recherche" />
      </b-form-group>
    </div>
    <div>
      <div v-for="post in posts" :key="post" class="card mb-3" style="max-width: 540px;">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img :src="post.featured_media" class="card-img" :alt="title" />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{ post.title }}</h5>
              <p class="card-text">
                {{ post.yoast_meta_desc[0] }}
              </p>
              <p class="card-text">
                <small class="text-muted">{{ post.date }}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-for="fiche in fiches" :key="fiche" class="card mb-3" style="max-width: 540px;">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img :src="fiche.featured_media" class="card-img" :alt="title" />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{ fiche.title }}</h5>
              <p class="card-text">
                {{ fiche.yoast_meta_desc[0] }}
              </p>
              <p class="card-text">
                <small class="text-muted">{{ fiche.date }}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      searchType: 'fiche',
      posts: [],
      fiches: [],
    }
  },
  watch: {
    searchText() {
      if (this.searchType === 'post') {
        this.searchPosts(this.searchText)
      } else {
        this.searchFiches(this.searchText)
      }
    },
  },
  methods: {
    async searchFiches(text) {
      this.fiches = await this.$esAPI.searchFichesByText(text)
    },
    async searchPosts(text) {
      this.posts = await this.$esAPI.searchPostsByText(text)
    },
  },
}
</script>

<style lang="scss" scoped></style>
