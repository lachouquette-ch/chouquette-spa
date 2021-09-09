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
    options: {
      customProperties: true,
      variations: false,
    },
    themes: {
      light: {
        primary: '#3D3B3C',
        secondary: '#9E9696',
        'cq-yellow': '#EFE407',
        'cq-blue': '#8DE3CE',
        'cq-blue-light': '#C5F9F5',
        'cq-red': '#D99056',
        'cq-red-light': '#F8B999',
        'cq-grey': '#3D3B3C',
        'cq-grey-light': '#9E9696',
        'cq-beige': '#F5F0EA',
      },
    },
  },
}
