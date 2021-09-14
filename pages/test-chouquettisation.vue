<template>
  <v-container>
    <v-card flat>
      <v-card-title class="text-break">
        <h1 class="text-h1">Es-tu apte à la Chouquettisation ?</h1>
      </v-card-title>
      <v-card-subtitle>
        Evalue ton entreprise/concept afin de savoir s'il matche aux valeurs de la Chouquette
      </v-card-subtitle>

      <v-stepper v-model="stepper" vertical flat>
        <v-stepper-step :complete="stepper > 1 && !!category" step="1" editable>
          Quel type d'adresse as-tu ?
          <small>Choisi parmis l'une de nos catégories</small>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-card flat>
            <v-select
              v-model="category"
              :items="categories"
              label="Ta catégorie"
              hint="Attention, si tu modifies ta catégorie, toutes tes réponses suivantes déjà remplies seront réinitilisées"
              item-text="name"
              item-value="slug"
            ></v-select>
            <v-card-actions>
              <v-btn
                color="primary"
                :disabled="!category"
                @click="
                  stepper = 2
                  changeCategory(category)
                "
                >Continuer</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <template v-for="(value, index) in Object.keys(form)">
          <v-stepper-step :key="`step_${index}`" :complete="stepper > index + 2" :step="index + 2" editable>{{
            form[value].name
          }}</v-stepper-step>
          <v-stepper-content :key="`content_${index}`" :step="index + 2">
            <v-card flat>
              <template v-if="form[value].mustAndCriteria.length">
                Critères :
                <v-checkbox
                  v-for="(criteria, indexValue) in form[value].mustAndCriteria"
                  :key="`mustAndCriteria_${indexValue}`"
                  v-model="form[value].mustAndSelection"
                  :label="criteria"
                  :value="indexValue"
                >
                </v-checkbox>
              </template>
              <template v-if="form[value].mustOrCriteria.length">
                Au moins l'un d'eux :
                <v-checkbox
                  v-for="(criteria, indexValue) in form[value].mustOrCriteria"
                  :key="`mustOrCriteria_${indexValue}`"
                  v-model="form[value].mustOrSelection"
                  :label="criteria"
                  :value="indexValue"
                >
                </v-checkbox>
              </template>
              <template v-if="form[value].couldCriteria.length">
                Encore mieux si :
                <v-checkbox
                  v-for="(criteria, indexValue) in form[value].couldCriteria"
                  :key="`couldCriteria_${indexValue}`"
                  v-model="form[value].couldSelection"
                  :label="criteria"
                  :value="indexValue"
                >
                </v-checkbox>
              </template>
              <v-card-actions>
                <v-btn
                  color="primary"
                  @click="
                    stepper = index + 3
                    computeValidatedValues()
                  "
                  >Continuer</v-btn
                >
                <v-btn text>Supprimer</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </template>

        <v-stepper-step step="7">Ton résultat</v-stepper-step>
        <v-stepper-content step="7">
          <v-chip-group>
            <v-chip
              v-for="value in validatedValues"
              :key="value.id"
              color="cq-blue-light"
              text-color="cq-secondary"
              label
              small
            >
              {{ value.name }}
            </v-chip>
          </v-chip-group>
        </v-stepper-content>
      </v-stepper>

      <v-card-text class="text-caption">
        Ce test est la propriété exclusive de La Chouquette SARL, il ne peut pas être reproduit ou utilisé dans son
        ensemble ou partiellement sans autorisation préalable. Pour toutes autres informations, merci de
        <nuxt-link to="/contact">nous contacter</nuxt-link>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import seo from '~/mixins/seo'

export default {
  mixins: [seo],
  computed: {
    ...mapState('categories', {
      categories: 'topLevels',
    }),
    ...mapState('values', { criteriaValue: 'criteria' }),
    ...mapGetters('values', { getValueBySlug: 'getBySlug' }),
    categorySlugs() {
      return this.categories.map(({ slug }) => slug)
    },
  },
  data() {
    return {
      stepper: 1,

      category: null,
      validatedValues: [],

      form: {
        local: {
          name: 'Local',
          mustAndCriteria: [],
          mustAndSelection: [],
          mustOrCriteria: [],
          mustOrSelection: [],
          couldCriteria: [],
          couldSelection: [],
        },
        ecologie: {
          name: 'Écologie',
          mustAndCriteria: [],
          mustAndSelection: [],
          mustOrCriteria: [],
          mustOrSelection: [],
          couldCriteria: [],
          couldSelection: [],
        },
        equitable: {
          name: 'Équitable',
          mustAndCriteria: [],
          mustAndSelection: [],
          mustOrCriteria: [],
          mustOrSelection: [],
          couldCriteria: [],
          couldSelection: [],
        },
        expertise: {
          name: 'Expertise',
          mustAndCriteria: [],
          mustAndSelection: [],
          mustOrCriteria: [],
          mustOrSelection: [],
          couldCriteria: [],
          couldSelection: [],
        },
        solidaire: {
          name: 'Solidaire',
          mustAndCriteria: [],
          mustAndSelection: [],
          mustOrCriteria: [],
          mustOrSelection: [],
          couldCriteria: [],
          couldSelection: [],
        },
      },
    }
  },
  methods: {
    changeCategory(categorySlug) {
      // compute criteria
      Object.keys(this.form).forEach((value) => {
        this.form[value].mustAndCriteria = this.getMustAndCriteria(this.criteriaValue[value], categorySlug)
        this.form[value].mustAndSelection = []
        this.form[value].mustOrCriteria = this.getMustOrCriteria(this.criteriaValue[value], categorySlug)
        this.form[value].mustOrSelection = []
        this.form[value].couldCriteria = this.getCouldCriteria(this.criteriaValue[value], categorySlug)
        this.form[value].couldSelection = []
      })
    },
    getMustAndCriteria(data, categorySlug) {
      const mustAndCriteria = data.filter(({ moscow, type, category }) => {
        return moscow === 'must' && type === 'and' && (category === null || category === categorySlug)
      })
      return mustAndCriteria.flatMap(({ criteria }) => criteria)
    },
    getMustOrCriteria(data, categorySlug) {
      const mustOrCriteria = data.filter(({ moscow, type, category }) => {
        return moscow === 'must' && type === 'or' && (category === null || category === categorySlug)
      })
      return mustOrCriteria.flatMap(({ criteria }) => criteria)
    },
    getCouldCriteria(data, categorySlug) {
      const couldCriteria = data.filter(({ moscow, category }) => {
        return moscow === 'could' && (category === null || category === categorySlug)
      })
      return couldCriteria.flatMap(({ criteria }) => criteria)
    },
    validateValue(valueSlug) {
      if (
        this.form[valueSlug].mustAndCriteria.length &&
        this.form[valueSlug].mustAndCriteria.length !== this.form[valueSlug].mustAndSelection.length
      )
        return false
      if (this.form[valueSlug].mustOrCriteria.length && !this.form[valueSlug].mustOrSelection.length) return false
      return true
    },
    computeValidatedValues() {
      this.validatedValues = []
      // local
      if (this.validateValue('local')) {
        this.validatedValues.push(this.getValueBySlug('local'))
      }
      // ecology
      if (this.validateValue('ecologie')) {
        this.validatedValues.push(this.getValueBySlug('ecologie'))
      }
      // fair
      if (this.validateValue('equitable')) {
        this.validatedValues.push(this.getValueBySlug('equitable'))
      }
      // expertise
      if (this.validateValue('expertise')) {
        this.validatedValues.push(this.getValueBySlug('expertise'))
      }
      // solidarity
      if (this.validateValue('solidaire')) {
        this.validatedValues.push(this.getValueBySlug('solidaire'))
      }
    },
  },
  head() {
    return {
      title: "Contacte un membre de l'équipe La Chouquette",
      script: [
        this.jsonLDScript({
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: 'Contacte-nous',
          description: "Contacte un membre de l'équipe La Chouquette",
          publisher: {
            '@type': 'Organization',
            name: 'La Chouquette',
            logo: `${this.$config.siteUrl}/logo.png`,
          },
          url: location.href,
        }),
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
h1 {
  font-family: $font-family-heading;
}
</style>
