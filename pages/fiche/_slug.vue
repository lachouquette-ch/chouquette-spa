<template>
  <v-container>
    <FicheShare :fiche="fiche" class="share"></FicheShare>
    <v-card flat>
      <WpMediaNew :media="fiche.image" size="medium_large" max-height="30vh" class="rounded">
        <v-card-subtitle class="d-flex">
          <v-chip v-if="fiche.isChouquettise" color="primary" text-color="black" small>
            Testé et Chouquettisé
            <v-icon right>mdi-check</v-icon>
          </v-chip>
        </v-card-subtitle>
      </WpMediaNew>
      <v-card-title class="pa-0 mt-2 align-center">
        <h1 class="text-h4">{{ fiche.title }}</h1>
        <v-spacer></v-spacer>
        <div class="d-flex justify-content-center">
          <v-btn fab icon small><v-icon color="#4267b2">mdi-facebook</v-icon></v-btn>
          <v-btn fab icon small><v-icon color="#E1306C">mdi-instagram</v-icon></v-btn>
        </div>
      </v-card-title>
      <p>{{ getLocationById(fiche.locationId).name }} / {{ categories }}</p>
      <p v-html="fiche.content"></p>
      <v-divider class="my-3"></v-divider>
      <h2 class="text-h6 mb-2">Comment s'y rendre ?</h2>
      <a
        :href="`https://www.google.com/maps?q=${fiche.address}`"
        target="_blank"
        class="d-inline-block text-decoration-none mb-1"
        >{{ fiche.address }} <span class="text-caption text-decoration-underline">(Ouvrir dans Maps)</span></a
      >
      <FichesMap :fiches="[fiche]" style="height: 300px" preview></FichesMap>
      <v-divider class="my-3"></v-divider>
      <h2 class="text-h6">Plus d'informations ?</h2>
      <v-list v-if="fiche.isChouquettise" class="pa-0">
        <v-subheader>Contact</v-subheader>
        <v-list-item>
          <v-list-item-avatar size="30"><v-icon>mdi-message</v-icon></v-list-item-avatar>
          <v-list-item-title>
            Envoyer un message au propriétaire
            <v-list-item-subtitle>Depuis La Chouquette</v-list-item-subtitle>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="fiche.info.telephone">
          <v-list-item-avatar size="30"><v-icon>mdi-phone</v-icon></v-list-item-avatar>
          <v-list-item-title>{{ fiche.info.telephone }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="fiche.info.website">
          <v-list-item-avatar size="30"><v-icon>mdi-web</v-icon></v-list-item-avatar>
          <v-list-item-title>
            {{ fiche.info.website | prettyURL }}
            <v-list-item-subtitle>Site Web</v-list-item-subtitle>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="fiche.info.website"
          :to="`mailto:${fiche.info.mail}?body=%0A---%0AEnvoy%C3%A9%20depuis%20${currentURL}`"
        >
          <v-list-item-avatar size="30"><v-icon>mdi-at</v-icon></v-list-item-avatar>
          <v-list-item-title>
            {{ fiche.info.mail }}
            <v-list-item-subtitle>Email</v-list-item-subtitle>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list class="pa-0">
        <v-subheader>Extra</v-subheader>
        <v-list-item
          v-if="fiche.info.cost"
          :to="`mailto:${fiche.info.mail}?body=%0A---%0AEnvoy%C3%A9%20depuis%20${currentURL}`"
          :inactive="true"
          :ripple="false"
        >
          <v-list-item-avatar size="30"><v-icon>mdi-cash</v-icon></v-list-item-avatar>
          <v-list-item-title>
            <span>{{ fichePrice[0] }}</span
            ><span class="grey--text text-lighten-3">{{ fichePrice[1] }}</span>
            <v-list-item-subtitle>Budget estimé</v-list-item-subtitle>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-list-item v-bind="attrs" v-on="on">
            <v-list-item-avatar size="30"><v-icon>mdi-clock</v-icon></v-list-item-avatar>
            <v-list-item-title>
              Aujourd'hui : {{ getOpeningValue() }}
              <v-list-item-subtitle>Autres jours</v-list-item-subtitle>
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-list dense>
          <v-list-item v-for="(item, index) in openingLabels" :key="index">
            <v-list-item-title>{{ item }} : {{ getOpeningValue(index) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-list>
        <v-subheader
          >Tags&nbsp;
          <v-tooltip max-width="90vw" top>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" small v-on="on">mdi-help-circle-outline</v-icon>
            </template>
            <span class="text-wrap"
              >Ce sont les tags liés à cette adresse. Les tags te permettent notamment d'affiner tes rechercher
              d'adresses.</span
            >
          </v-tooltip>
        </v-subheader>
        <v-list-item>
          <v-list-item-content class="pa-0">
            <v-chip-group v-if="fiche.criteria" column>
              <v-chip
                v-for="criteriaValue in criteriaValues"
                :key="criteriaValue.id"
                color="primary lighten-4"
                text-color="grey darken-3"
                label
                small
              >
                {{ criteriaValue.name }}</v-chip
              >
            </v-chip-group>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn color="secondary" block outlined
        ><v-icon left>mdi-alert-circle-outline</v-icon>Indiquer une erreur / précision</v-btn
      >
    </v-card>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { fiche as FicheFragments } from '@/apollo/fragments/fiche'
import { postCard as PostCardFragments } from '@/apollo/fragments/postCard'
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import seo from '~/mixins/seo'
import WpMediaNew from '~/components/WpMediaNew'
import FichesMap from '~/components/FichesMap'
import FicheShare from '~/components/FicheShare'

export default {
  components: { FicheShare, FichesMap, WpMediaNew },
  mixins: [seo],
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
  computed: {
    ...mapGetters('locations', {
      getLocationById: 'getById',
    }),
    ...mapGetters('categories', {
      getCategoryById: 'getById',
    }),
    categories() {
      return this.fiche.categoryIds.map((id) => this.getCategoryById(id).name).join(', ')
    },
    fichePrice() {
      return ['$'.repeat(this.fiche.info.cost), '$'.repeat(5 - this.fiche.info.cost)]
    },
    openingLabels() {
      return ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    },
    currentDayOfWeek() {
      return moment().locale('fr-CH').format('dddd')
    },
    criteriaValues() {
      return _.uniq(
        this.fiche.criteria.flatMap((criteria) => criteria.values),
        'id'
      )
    },
  },
  methods: {
    getOpeningValue(dayOfWeek = new Date().getDay()) {
      const opening = this.fiche.info.openings[dayOfWeek]
      if (opening) {
        return opening.includes('closed') ? 'fermé' : opening
      } else {
        return ''
      }
    },
  },
  data() {
    return {
      fiche: null,
      posts: [],
      show: false,
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
.share {
  position: fixed;
  right: 10px;
  bottom: 70px;
  z-index: 1;
}
</style>
