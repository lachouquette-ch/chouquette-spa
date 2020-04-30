<template>
  <div clasS="layout-content">
    <div class="container">
      <h1 class="text-center my-4">Résultats pour "{{ searchText }}"</h1>
      <div class="row">
        <div class="col">
          <Fiche v-for="fiche in fiches" :key="fiche.id" :fiche="fiche" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Fiche from '~/components/Fiche'
import PostCard from '~/components/PostCard'
export default {
  components: { PostCard, Fiche },
  async asyncData({ params, store, app }) {
    const [posts, fiches] = await Promise.all([
      store.dispatch('posts/fetchByText', params.search),
      store.dispatch('fiches/fetchByText', params.search)
    ])

    return {
      searchText: params.search,
      posts,
      fiches
    }
  }
}
</script>

<style lang="scss" scoped></style>
