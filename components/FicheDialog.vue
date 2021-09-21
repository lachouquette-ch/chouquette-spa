<template>
  <v-dialog v-model="dialog" color="white" fullscreen scrollable transition="slide-x-reverse-transition">
    <v-card tile>
      <v-card-title>
        <FicheShare v-if="fiche" :fiche="fiche" small color="primary">Partager</FicheShare>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-2 pb-0">
        <Fiche :fiche="fiche"></Fiche>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FicheShare from '~/components/FicheShare'
import Fiche from '~/components/Fiche'

export default {
  components: { Fiche, FicheShare },
  props: {
    fiche: {
      required: true,
      type: Object,
    },
    value: Boolean,
  },
  data() {
    return {
      dialog: false,
    }
  },
  watch: {
    value: {
      handler(val) {
        this.dialog = val
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.dialog = false
      this.$emit('input', false)
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped></style>
