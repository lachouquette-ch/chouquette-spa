<template>
  <v-container>
    <FicheShare :fiche="fiche" class="share" fab dark></FicheShare>

    <Fiche :fiche="fiche"></Fiche>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { fiche as FicheFragments } from '@/apollo/fragments/fiche'
import { ficheCard as FicheCardFragments } from '@/apollo/fragments/ficheCard'
import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import seo from '~/mixins/seo'
import FicheShare from '~/components/FicheShare'
import graphql from '~/mixins/graphql'
import Fiche from '~/components/Fiche'

export default {
  components: { Fiche, FicheShare },
  mixins: [seo, graphql],
  async asyncData(context) {
    const { app, store, params, route, error } = context

    const client = app.apolloProvider.defaultClient

    const fiche = await client
      .query({
        query: gql`
          query ($slug: String!) {
            ficheBySlug(slug: $slug) {
              ...FicheFragments

              postCards {
                ...PostCardFragments
              }

              similarFiches {
                ...FicheCardFragments
              }
            }
          }
          ${FicheFragments}
          ${PostCardFragments}
          ${FicheCardFragments}
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

          url: location.href,
          datePublished: this.fiche.date,
          dateModified: this.fiche.modified,
        }),
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.share {
  position: fixed;
  right: 10px;
  bottom: 70px;
  z-index: 1;
}
</style>
