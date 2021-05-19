<template>
  <div class="fiche-page layout-content container my-4">
    <h1 class="text-center mb-4">{{ fiche.title }}</h1>
    <main role="main">
      <Fiche :fiche="fiche" no-ref-link flat-enable />
    </main>
    <div class="mt-4">
      <template v-if="fiche.postCards">
        <h2 class="text-center mb-4">
          <span v-if="posts.length === 1">L'article</span>
          <span v-else>Les articles</span>
        </h2>
        <div class="post-card-shuffler d-flex flex-wrap align-items-center justify-content-center">
          <nuxt-link v-for="post in fiche.postCards" :key="post.id" :to="{ path: `/${post.slug}` }" class="post-card">
            <PostCard :post="post" class="mx-auto" />
          </nuxt-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { fiche as FicheFragments } from '@/apollo/fragments/fiche'
import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import Fiche from '~/components/Fiche'
import PostCard from '~/components/PostCard'
import seo from '~/mixins/seo'

export default {
  components: { Fiche, PostCard },
  mixins: [seo],
  async asyncData(context) {
    const { app, store, params, route, error } = context

    const client = app.apolloProvider.defaultClient

    const fiche = await client
      .query({
        query: gql`
          query($slug: String!) {
            ficheBySlug(slug: $slug) {
              ...FicheFragments

              postCards {
                ...PostCardFragments
              }
            }
          }
          ${FicheFragments}
          ${PostCardFragments}
        `,
        variables: { slug: params.slug },
      })
      .then(({ data }) => data.ficheBySlug)
    if (!fiche) {
      await store.dispatch('yoast/redirect', { path: route.path, context })
      error({ statusCode: '404', message: `'${params.slug}' n'existe pas` })
    }

    return {
      fiche,
    }
  },
  data() {
    return {
      fiche: null,
      posts: [],
    }
  },
  head() {
    return {
      title: this.fiche.seo.title,
      meta: [
        ...this.seoMetaProperties(JSON.parse(this.fiche.seo.metadata)),
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.fiche.featured_img,
        },
      ],
      script: [
        this.jsonLDScript({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: this.fiche.seo.title,
          description: this.seoGetDescription(JSON.parse(this.fiche.seo.metadata)),
          image: this.fiche.image.source,

          address: this.fiche.info.address,
          email: this.fiche.info.mail,
          telephone: this.fiche.telephone,
          photo: this.fiche.image.source,

          url: this.currentURL,
          datePublished: this.fiche.date,
          dateModified: this.fiche.modified,
        }),
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.fiche-page {
  h1 {
    font-family: $font-family-heading;
  }
}
</style>
