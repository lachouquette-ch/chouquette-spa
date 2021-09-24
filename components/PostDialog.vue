<template>
  <v-dialog v-model="dialog" color="white" fullscreen scrollable transition="slide-x-reverse-transition">
    <v-card tile>
      <v-card-title>
        <PostShare :post="post" small color="primary">Partager</PostShare>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text ref="content" class="pa-2 pb-0">
        <WpPostNew :post="post"></WpPostNew>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import gql from 'graphql-tag'
import {post as PostFragments} from '~/apollo/fragments/post'
import graphql from '~/mixins/graphql'
import WpPostNew from '~/components/WpPostNew'
import PostShare from '~/components/PostShare'

export default {
  components: { WpPostNew, PostShare },
  mixins: [graphql],
  props: {
    value: Object,
  },
  data() {
    return {
      dialog: false,
      previousURL: null,
      post: null,
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          if (!val.slug) throw new Error('PostDialog requires an object (post) with slug property')
          this.fetchPostBySlug(val.slug)
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

        this.post = data.postBySlug
        this.previousURL = location.href
        history.replaceState(null, null, `/${slug}`)
        this.dialog = true
        this.$nextTick(() => {
          this.$refs.content.scrollTop = 0
        })
      } catch (e) {
        this.$sentry.captureException(e)
        this.$store.dispatch('alerts/addAction', {
          type: 'warning',
          message: `Problème lors du chargement de l'article : ${this.parseGQLError(e)}`,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
