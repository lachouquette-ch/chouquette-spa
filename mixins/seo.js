export default {
  computed: {
    currentURL() {
      return `${this.$config.baseURL}${this.$route.fullPath}`
    },
  },
  methods: {
    yoastGetDescription(yoastMeta) {
      const ogDescription = yoastMeta.find(({ property }) => property === 'og:description')
      return ogDescription ? this.$options.filters.heDecode(ogDescription.content) : ''
    },
    yoastMetaProperties(yoastMeta) {
      const metaProperties = yoastMeta.map((metaProperty) => {
        return {
          ...metaProperty,
          content: this.$options.filters.heDecode(metaProperty.content),
          hid: metaProperty.name || metaProperty.property,
        }
      })

      // helper to udpate/create new property
      const metadataUpdateHelper = (name, content, nameAttr = 'name') => {
        const property = metaProperties.find(({ property }) => property === name)
        if (property) {
          property.content = content
        } else {
          metaProperties.push({
            hid: name,
            [nameAttr]: name,
            content,
          })
        }
      }

      // hack URL
      metadataUpdateHelper('og:url', this.currentURL, 'property')

      // add twitter missing meta data
      metadataUpdateHelper('twitter:site', this.currentURL)
      const image = metaProperties.find(({ property }) => property === 'og:image')
      metadataUpdateHelper('twitter:image', image ? image.content : `${this.$config.baseURL}/logo.png`)

      return metaProperties
    },
    jsonLDScript(...additionnalContext) {
      const companyContext = {
        '@context': 'http://www.schema.org',
        '@type': 'Organization',
        name: 'La Chouquette',
        url: this.$config.baseURL,
        logo: `${this.$config.baseURL}/logo.png`,
        foundingDate: '2014',
        founders: [
          {
            '@type': 'Person',
            name: 'Cyrielle',
          },
          {
            '@type': 'Person',
            name: 'Fabrice',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lausanne',
          addressRegion: 'Vaud',
          addressCountry: 'Suisse',
        },
        sameAs: ['https://www.facebook.com/lachouquettelausanne', 'https://www.instagram.com/lachouquette.ch/?hl=fr'],
      }

      const webSiteContext = {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        name: 'La Chouquette',
        url: this.$config.baseURL,
        sameAs: ['https://www.facebook.com/lachouquettelausanne', 'https://www.instagram.com/lachouquette.ch/?hl=fr'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${this.$config.baseURL}/search/{search_term}`,
          'query-input': 'required name=search_term',
        },
      }

      const jsonLD = {
        type: 'application/ld+json',
        json: [companyContext, webSiteContext, ...additionnalContext],
      }

      return jsonLD
    },
  },
}
