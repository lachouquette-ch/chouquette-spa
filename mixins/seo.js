export default {
  methods: {
    yoastMetaProperties(yoastMeta) {
      const metaProperties = yoastMeta.map((metaProperty) => {
        return {
          ...metaProperty,
          content: this.$options.filters.heDecode(metaProperty.content),
          hid: metaProperty.name || metaProperty.property
        }
      })

      // hack URL
      const ogURL = metaProperties.find(({ property }) => property === 'og:url')
      if (ogURL) {
        ogURL.content = window.location.href
      } else {
        metaProperties.push({
          hid: 'og:url',
          property: 'og:url',
          content: window.location.href
        })
      }

      return metaProperties
    },
    jsonLDScript(...additionnalContext) {
      const logo = `${window.location.origin}/logo.png`
      const companyContext = {
        '@context': 'http://www.schema.org',
        '@type': 'Organization',
        name: 'La Chouquette',
        url: 'https://lachouquette.ch',
        logo,
        foundingDate: '2014',
        founders: [
          {
            '@type': 'Person',
            name: 'Cyrielle'
          },
          {
            '@type': 'Person',
            name: 'Fabrice'
          }
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lausanne',
          addressRegion: 'Vaud',
          addressCountry: 'Suisse'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Information',
          email: 'hello@lachouquette.ch'
        },
        sameAs: ['https://www.facebook.com/lachouquettelausanne/', 'https://www.instagram.com/lachouquettelausanne']
      }

      const jsonLD = {
        type: 'application/ld+json',
        json: [companyContext, ...additionnalContext]
      }

      return jsonLD
    }
  }
}
