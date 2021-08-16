import fr from 'vuetify/lib/locale/fr'

export default {
  breakpoint: {
    mobileBreakpoint: 'xs', // This is equivalent to a value of 960
  },
  icons: {},
  lang: {
    locales: { fr },
    current: 'fr',
  },
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#F8EF28',
        anchor: '#000000',
        'green-chouquette': '#A5D6A7',
        'yellow-chouquette': '#F8EF28',
      },
    },
  },
}
