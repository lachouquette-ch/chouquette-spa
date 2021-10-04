<template>
  <v-dialog
    v-model="dialog"
    color="white"
    scrollable
    transition="slide-x-reverse-transition"
    v-bind="{ ...$props, ...$attrs }"
    @close="close"
    @click:outside="close"
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
        <Fiche v-if="fiche" :fiche="fiche"></Fiche>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FicheShare from '~/components/FicheShare'
import Fiche from '~/components/Fiche'
import graphql from '~/mixins/graphql'

export default {
  components: { Fiche, FicheShare },
  mixins: [graphql],
  props: {
    value: Boolean,
    fiche: Object,
    replaceUrl: Boolean,
  },
  data() {
    return {
      dialog: false,
      previousURL: null,
    }
  },
  watch: {
    value(val) {
      this.dialog = val
      if (this.dialog) {
        if (this.replaceUrl) {
          this.previousURL = location.href
          history.replaceState(null, null, `/fiche/${this.fiche.slug}`)
        }
        // scroll top
        this.$nextTick(() => {
          this.$refs.content.scrollTop = 0
        })
      }
    },
  },
  methods: {
    close() {
      if (this.replaceUrl) {
        history.replaceState(null, null, this.previousURL)
      }
      this.dialog = false
      this.$emit('input', false)
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped></style>
