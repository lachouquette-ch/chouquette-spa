import gql from 'graphql-tag'
import {fiche as FicheFragments} from '~/apollo/fragments/fiche'
import {postCard as PostCardFragments} from '~/apollo/fragments/postCard'
import {ficheCard as FicheCardFragments} from '~/apollo/fragments/ficheCard'

export default {
  methods: {
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
