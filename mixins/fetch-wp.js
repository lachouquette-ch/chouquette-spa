/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import gql from 'graphql-tag'
import { post as PostFragments } from '~/apollo/fragments/post'
import { fiche as FicheFragments } from '~/apollo/fragments/fiche'
import { postCard as PostCardFragments } from '~/apollo/fragments/postCard'
import { ficheCard as FicheCardFragments } from '~/apollo/fragments/ficheCard'

export default {
  methods: {
    async fetchPostBySlug(slug) {
      try {
        const { data } = await this.$apollo.query({
          query: gql`
            query ($slug: String!) {
              postBySlug(slug: $slug) {
                ...PostFragments
              }
            }
            ${PostFragments}
          `,
          variables: {
            slug,
          },
        })

        return data.postBySlug
      } catch (e) {
        this.$sentry.captureException(e)
        this.$store.dispatch('alerts/addAction', {
          type: 'warning',
          message: `Problème lors du chargement de l'article : ${this.parseGQLError(e)}`,
        })
      }
    },
    async fetchFicheBySlug(slug) {
      try {
        const { data } = await this.$apollo.query({
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
          variables: { slug },
        })

        return data.ficheBySlug
      } catch (e) {
        this.$sentry.captureException(e)
        this.$store.dispatch('alerts/addAction', {
          type: 'warning',
          message: `Problème lors du chargement de l'adresse' : ${this.parseGQLError(e)}`,
        })
      }
    },
  },
}
