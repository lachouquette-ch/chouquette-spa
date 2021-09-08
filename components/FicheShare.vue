<template>
  <div>
    <template v-if="shareApiAvailable">
      <v-btn
        v-bind="{ ...$props, ...$attrs }"
        @click.prevent="shareWith('Fiche sur La Chouquette', escapedTitle, currentURL)"
      >
        <v-icon :left="!!$slots.default">mdi-share-variant</v-icon>
        <slot></slot>
      </v-btn>
    </template>
    <template v-else>
      <v-menu top>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="{ ...attrs, ...$props, ...$attrs }" v-on="on">
            <v-icon :left="!!$slots.default">mdi-share-variant</v-icon>
            <slot></slot>
          </v-btn>
        </template>

        <v-list>
          <v-list-item target="_blank" :to="`https://www.facebook.com/sharer/sharer.php?u=${currentURL}`">
            <v-list-item-title><v-icon color="#4267b2" class="mr-2">mdi-facebook</v-icon>Facebook</v-list-item-title>
          </v-list-item>
          <v-list-item
            target="_blank"
            :to="`https://twitter.com/share?text=${escapedTitle}&url=${encodeURI(currentURL)}`"
          >
            <v-list-item-title><v-icon color="#38a1f3" class="mr-2">mdi-twitter</v-icon>Twitter</v-list-item-title>
          </v-list-item>
          <v-list-item
            target="_blank"
            :to="`mailto:?subject=${escapedTitle}&amp;body=Je te partage cet article ${currentURL}`"
          >
            <v-list-item-title><v-icon color="#b7b7b7" class="mr-2">mdi-at</v-icon> Email</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </div>
</template>

<script>
import share from '~/mixins/share'
import seo from '~/mixins/seo'

export default {
  mixins: [share, seo],
  props: {
    fiche: {
      required: true,
      type: Object,
    },
  },
  computed: {
    escapedTitle() {
      return this.fiche.title
    },
  },
}
</script>

<style scoped></style>
