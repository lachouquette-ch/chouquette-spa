<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-container>
    <FicheShare :fiche="fiche" class="cq-share-position" fab color="primary"></FicheShare>

    <Fiche :fiche="fiche" class="cq-md-max-width"></Fiche>
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
    const { app, store, params, route } = context

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
      await store.dispatch('yoast/redirect', {
        path: route.path,
        context,
        fallback: { statusCode: 404, message: `'${params.slug}' n'existe pas` },
      })
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
          content: this.fiche.image ? this.fiche.image.source : '',
        },
      ],
      script: [
        this.jsonLDScript({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: this.fiche.seo.title,
          description: this.seoGetDescription(JSON.parse(this.fiche.seo.metadata)),
          image: this.fiche.image ? this.fiche.image.source : '',

          address: this.fiche.info.address,
          email: this.fiche.info.mail,
          telephone: this.fiche.telephone,
          photo: this.fiche.image ? this.fiche.image.source : '',

          url: this.currentURL,
          datePublished: this.fiche.date,
          dateModified: this.fiche.modified,
        }),
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
