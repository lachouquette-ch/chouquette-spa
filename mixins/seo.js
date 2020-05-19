export default {
  computed: {
    currentURL() {
      return `${process.env.baseUrl}${this.$route.fullPath}`
    }
  },
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
        ogURL.content = this.currentURL
      } else {
        metaProperties.push({
          hid: 'og:url',
          property: 'og:url',
          content: this.currentURL
        })
      }

      return metaProperties
    },
    jsonLDScript(...additionnalContext) {
      const companyContext = {
        '@context': 'http://www.schema.org',
        '@type': 'Organization',
        name: 'La Chouquette',
        url: process.env.baseUrl,
        logo: `${process.env.baseUrl}/logo.png`,
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

      const webSiteContext = {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        name: 'La Chouquette',
        url: process.env.baseUrl,
        sameAs: ['https://www.facebook.com/lachouquettelausanne/', 'https://www.instagram.com/lachouquettelausanne'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `process.env.baseUrl/search/{search_term}`,
          'query-input': 'required name=search_term'
        }
      }

      const jsonLD = {
        type: 'application/ld+json',
        json: [companyContext, webSiteContext, ...additionnalContext]
      }

      return jsonLD
    }
  }
}
