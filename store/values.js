export const state = () => ({
  all: {},
  flat: [],
  criteria: {
    local: [
      {
        moscow: 'must',
        category: null,
        type: 'and',
        criteria: [
          "S'approvisionner avec des produits suisses quand ils sont disponibles dans le pays sinon favoriser les pays limitrophes",
          'Fait maison ou cuisiné/fabriqué par des tiers de proximité',
        ],
      },
      {
        moscow: 'could',
        category: null,
        type: 'or',
        criteria: ["On s'approvisionne au marché et/ou auprès de petits producteurs"],
      },
    ],
    ecologie: [
      {
        moscow: 'must',
        category: null,
        type: 'and',
        criteria: [
          'Connaître et mettre en place les règles de recyclage',
          'Respecter la faune et la flore',
          "Avoir un personnel formé et sensibilisé à l'écologie",
          'Trouver des solutions alternatives écologiques à tout le matériel jetable (couverts, serviettes, gobelets...) et accepter des contenants réutilisables : ReCircle, personnel, ...',
          'Ne pas proposer de sac plastique, mais des tote bags en coton Bio certifié ou des sachets en papier kraft issus de forêts gérées, ...',
        ],
      },
      {
        moscow: 'could',
        category: null,
        type: 'or',
        criteria: [
          'On utilise du mobilier et des ustensiles fabriqués dans des matériaux durables et écologiques ou de seconde main',
          "Utiliser des produits d'entretiens écologiques",
          "On privilégie une communication verte (imprimerie labellisée, papier avec un label environnemental ou ensemencé, impression à l'encre végétale ou encore la dématérialisation de certains supports de communication)",
          "On calcule régulièrement son empreinte CO2  (outils comme WWF  - Le climat entre nos mains - MyClimate - Global Footprint Network) dans un but d'amélioration continue",
          'On réduit au maximum son empreinte CO2 en privilégiant les transports / livraisons en vélo, transport publics, véhicules électriques, partage de voitures (Mobility,...)',
          'On compense ses émissions de CO2 en finançant un ou plusieurs projets écologiques',
        ],
      },
      {
        moscow: 'must',
        category: 'bar-et-restaurant',
        type: 'and',
        criteria: [
          'Respecter du cycle des saisons',
          "Privilégier les produits bios, biodynamiques ou issus de l'agriculture raisonnée",
          'Proposer au minimum une alternative végétarienne, et si possible végane afin de limiter la consommation de viande',
          "Limiter au maximum le gaspillage alimentaire en donnant les invendus à des associations ou utiliser l'application To Good To Go...",
          'Contrôler rigoureusement ses stock et les dates de péremption.',
          "Servir des quantités adaptées à la consommation réelle des clients en bannissant les buffets et formules 'à volonté'",
        ],
      },
      {
        moscow: 'must',
        category: 'shopping',
        type: 'and',
        criteria: [
          'Proposer à la vente des produits éthiques, recyclés, locaux, artisanaux, réparables, éco-conçus, qui favorisent les éco-gestes (contenants, gourdes...), de seconde main.',
          "On privilégie les labels : Gots / Oeko-Tex, OCS, Bluedesign, GRS, PETA, RWS,... pour l'univers de la mode. Bio, Demeter... pour l'alimentation.",
        ],
      },
      {
        moscow: 'could',
        category: 'shopping',
        type: 'or',
        criteria: ['Boycotter le Black Friday en le remplaçant par exemple par le Fair Friday'],
      },
    ],
    equitable: [
      {
        moscow: 'must',
        category: null,
        type: 'or',
        criteria: [
          "Connaître sa chaîne d'approvisionnement de bout en bout pour les produits locaux ou étrangers",
          "Faire confiance à des labels reconnus qui s'assurent que les engagements (respect du droit humain, rémunération équitable) soient respectés : Fair Wear Foundation, Fairtrade, Fairtrade Certified, GOTS, SA8000...",
        ],
      },
      {
        moscow: 'must',
        category: null,
        type: 'and',
        criteria: [
          "Engager du personnel sans discrimination de race, de sexe, de poids, d'orientation sexuelle, de religion, d'âge, d'handicap, de culture ou toute autre forme discriminatoire.",
          "Ne fait pas de différence de salaire entre les hommes et les femmes et respecte les tarifs minimums de salaires dans sa branche d'activité.",
        ],
      },
    ],
    expertise: [
      {
        moscow: 'must',
        category: null,
        type: 'and',
        criteria: [
          'Proposer une spécialité ou un concept novateur / de niche',
          'Avoir une expérience professionnelle associée au concept ou des titres honorifiques dans le domaine',
        ],
      },
    ],
    solidaire: [
      {
        moscow: 'must',
        category: null,
        type: 'or',
        criteria: [
          "Reverser une partie de son chiffre d'affaires à des causes environnementales, sociétales ou animales",
          'Proposer des actions de dons (passage en caisse, événements, cagnotte...)',
          'Organiser des collectes alimentaires, vêtements, jouets, matériel de puériculture, ...',
          'Participer à des mesures de réinsertion professionnelle',
        ],
      },
    ],
  },
  criteriaCategory: {
    'bar-et-restaurant': {
      local: 'must',
      ecologie: 'should',
      equitable: 'should',
      expertise: 'should',
      solidaire: 'should',
    },
    loisirs: {
      local: 'wont',
      ecologie: 'must',
      equitable: 'should',
      expertise: 'must',
      solidaire: 'should',
    },
    culture: {
      local: 'wont',
      ecologie: 'wont',
      equitable: 'should',
      expertise: 'must',
      solidaire: 'should',
    },
    shopping: {
      local: 'should',
      ecologie: 'should',
      equitable: 'should',
      expertise: 'should',
      solidaire: 'should',
    },
    services: {
      local: 'wont',
      ecologie: 'should',
      equitable: 'should',
      expertise: 'should',
      solidaire: 'should',
    },
  },
})

export const actions = {
  init({ state, commit }, values) {
    commit('SET_VALUES', values)

    return values
  },

  isDisabledForCategory({ state }, { valueSlug, categorySlug }) {
    return state.criteriaCategory[categorySlug][valueSlug] === 'wont'
  },

  isOptionalForCategory({ state }, { valueSlug, categorySlug }) {
    return state.criteriaCategory[categorySlug][valueSlug] !== 'must'
  },
}

export const getters = {
  getBySlug: (state) => (searchSlug) => state.flat.find(({ slug }) => slug === searchSlug),

  getById: (state) => (id) => state.all[id],

  getMustAndCriteria: (state) => (valueSlug, categorySlug) => {
    const mustAndCriteria = state.criteria[valueSlug].filter(({ moscow, type, category }) => {
      return moscow === 'must' && type === 'and' && (category === null || category === categorySlug)
    })
    return mustAndCriteria.flatMap(({ criteria }) => criteria)
  },

  getMustOrCriteria: (state) => (valueSlug, categorySlug) => {
    const mustOrCriteria = state.criteria[valueSlug].filter(({ moscow, type, category }) => {
      return moscow === 'must' && type === 'or' && (category === null || category === categorySlug)
    })
    return mustOrCriteria.flatMap(({ criteria }) => criteria)
  },

  getCouldCriteria: (state) => (valueSlug, categorySlug) => {
    const couldCriteria = state.criteria[valueSlug].filter(({ moscow, category }) => {
      return moscow === 'could' && (category === null || category === categorySlug)
    })
    return couldCriteria.flatMap(({ criteria }) => criteria)
  },
}

export const mutations = {
  SET_VALUES(state, values) {
    state.all = values.reduce((acc, value) => {
      acc[parseInt(value.id)] = value
      return acc
    }, {})
    state.flat = values
  },
}
