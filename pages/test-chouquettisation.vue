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
          <v-stepper-step :key="`step_${index}`" :complete="stepper > index + 2" :step="index + 2" editable>
            {{ form[value].name }}
            <small v-if="form[value].optional === false">Valeur essentielle pour ta Chouquettisation</small>
          </v-stepper-step>
          <v-stepper-content :key="`content_${index}`" :step="index + 2">
            <v-card flat>
              <v-card-text v-if="form[value].disabled" class="pa-0">
                Cette valeur n'est pas prise en compte pour cette categérie
              </v-card-text>
              <v-card-text v-else class="pa-0">
                <template v-if="form[value].mustAndCriteria.length">
                  Les intransigibles :
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
              </v-card-text>
              <v-card-actions class="flex-wrap">
                <v-btn color="primary" class="mt-2" @click="stepper = index + 3">Voir la suite</v-btn>
                <v-btn v-if="stepperFinished" color="secondary" class="mt-2" @click="stepper = 7">
                  Vers le résultats
                </v-btn>
                <v-btn v-if="!form[value].disabled" text class="mt-2" @click="clearFormValue(value)">Supprimer</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </template>

        <v-stepper-step step="7">Ton résultat</v-stepper-step>
        <v-stepper-content step="7">
          <v-card v-if="unvalidatedValues.length === 0" flat class="pb-2">
            <p class="text-h3">Bravo, tu y est arrivé !</p>
            <p>
              <span>Les valeurs validées : </span>
              <v-chip
                v-for="value in validatedValues"
                :key="value.id"
                color="cq-blue-light"
                text-color="cq-secondary"
                label
                small
                class="mr-2"
              >
                {{ value.name }}
              </v-chip>
            </p>
            <p class="my-2">Tu souhaites aller plus loin avec La Chouquette ?</p>
            <v-btn color="cq-yellow" block>Contacte-nous</v-btn>
          </v-card>
          <v-card v-else flat class="pb-2">
            <p class="text-h3">Malheureusement tu ne remplis pas tous les critères pour une Chouquettisation</p>
            <p>
              <span>Les valeurs validées : </span>
              <v-chip
                v-for="value in validatedValues"
                :key="value.id"
                color="cq-blue-light"
                text-color="cq-secondary"
                label
                small
                class="mr-2"
              >
                {{ value.name }}
              </v-chip>
            </p>
            <p>
              <span>Les valeurs manquantes : </span>
              <v-chip
                v-for="value in unvalidatedValues"
                :key="value.id"
                color="cq-secondary"
                text-color="cq-primary"
                label
                small
                class="mr-2"
              >
                {{ value.name }}
              </v-chip>
            </p>
          </v-card>
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
import { mapState, mapGetters, mapActions } from 'vuex'
import seo from '~/mixins/seo'

export default {
  mixins: [seo],
  computed: {
    ...mapState('categories', {
      categories: 'topLevels',
    }),
    ...mapState('values', { criteriaValue: 'criteria' }),
    ...mapGetters('values', { getValueBySlug: 'getBySlug' }),
    ...mapGetters('values', ['getMustAndCriteria', 'getMustOrCriteria', 'getCouldCriteria']),
    categorySlugs() {
      return this.categories.map(({ slug }) => slug)
    },
  },
  data() {
    return {
      stepper: 1,
      stepperFinished: false,

      category: null,
      validatedValues: [],
      unvalidatedValues: [],

      form: {
        local: {
          name: 'Local',
          disabled: null,
          optional: null,
          mustAndCriteria: [],
          mustAndSelection: [],
          mustOrCriteria: [],
          mustOrSelection: [],
          couldCriteria: [],
          couldSelection: [],
        },
        ecologie: {
          name: 'Écologie',
          disabled: null,
          optional: null,
          mustAndCriteria: [],
          mustAndSelection: [],
          mustOrCriteria: [],
          mustOrSelection: [],
          couldCriteria: [],
          couldSelection: [],
        },
        equitable: {
          name: 'Équitable',
          disabled: null,
          optional: null,
          mustAndCriteria: [],
          mustAndSelection: [],
          mustOrCriteria: [],
          mustOrSelection: [],
          couldCriteria: [],
          couldSelection: [],
        },
        expertise: {
          name: 'Expertise',
          disabled: null,
          optional: null,
          mustAndCriteria: [],
          mustAndSelection: [],
          mustOrCriteria: [],
          mustOrSelection: [],
          couldCriteria: [],
          couldSelection: [],
        },
        solidaire: {
          name: 'Solidaire',
          disabled: null,
          optional: null,
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
  watch: {
    stepper() {
      this.computeValueScore()
      if (this.stepper === 7) {
        this.stepperFinished = true
      }
    },
  },
  methods: {
    ...mapActions('values', ['isDisabledForCategory', 'isOptionalForCategory']),
    changeCategory(categorySlug) {
      // compute criteria
      Object.keys(this.form).forEach(async (valueSlug) => {
        this.form[valueSlug].mustAndCriteria = this.getMustAndCriteria(valueSlug, categorySlug)
        this.form[valueSlug].mustAndSelection = []
        this.form[valueSlug].mustOrCriteria = this.getMustOrCriteria(valueSlug, categorySlug)
        this.form[valueSlug].mustOrSelection = []
        this.form[valueSlug].couldCriteria = this.getCouldCriteria(valueSlug, categorySlug)
        this.form[valueSlug].couldSelection = []

        this.form[valueSlug].disabled = await this.isDisabledForCategory({ valueSlug, categorySlug })
        this.form[valueSlug].optional = await this.isOptionalForCategory({ valueSlug, categorySlug })
      })
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
    clearFormValue(valueSlug) {
      this.form[valueSlug].mustAndSelection = []
      this.form[valueSlug].mustOrSelection = []
      this.form[valueSlug].couldSelection = []
    },
    computeValueScore() {
      this.validatedValues = []
      this.unvalidatedValues = []
      Object.keys(this.form).forEach(async (valueSlug) => {
        if (this.validateValue(valueSlug)) {
          this.validatedValues.push(this.getValueBySlug(valueSlug))
        } else if (!(await this.isOptionalForCategory({ valueSlug, categorySlug: this.category }))) {
          this.unvalidatedValues.push(this.getValueBySlug(valueSlug))
        }
      })
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
