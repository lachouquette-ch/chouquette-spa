<template>
  <v-dialog
    v-model="dialog"
    color="white"
    scrollable
    transition="slide-x-reverse-transition"
    v-bind="{ ...$props, ...$attrs }"
  >
    <v-card tile>
      <v-card-title>
        <FicheShare v-if="fiche" :fiche="fiche" small color="primary">Partager</FicheShare>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text ref="content" class="pa-2 pb-0">
        <Fiche :fiche="fiche"></Fiche>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import gql from 'graphql-tag'
import FicheShare from '~/components/FicheShare'
import Fiche from '~/components/Fiche'
import {fiche as FicheFragments} from '~/apollo/fragments/fiche'
import {postCard as PostCardFragments} from '~/apollo/fragments/postCard'
import {ficheCard as FicheCardFragments} from '~/apollo/fragments/ficheCard'
import graphql from '~/mixins/graphql'

export default {
  components: { Fiche, FicheShare },
  mixins: [graphql],
  props: {
    value: Object,
  },
  data() {
    return {
      dialog: false,
      previousURL: null,
      fiche: null,
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          if (!val.slug) throw new Error('FicheDialog requires an object (fiche) with slug property')
          this.fetchFicheBySlug(val.slug)
        }
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.dialog = false
      history.replaceState(null, null, this.previousURL)
      this.$emit('input', false)
      this.$emit('close')
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

        this.fiche = data.ficheBySlug
        this.previousURL = location.href
        history.replaceState(null, null, `/fiche/${slug}`)
        this.dialog = true
        this.$nextTick(() => {
          this.$refs.content.scrollTop = 0
        })
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
</script>

<style lang="scss" scoped></style>
