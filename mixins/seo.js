export default {
  methods: {
    seoGetDescription(yoastMeta) {
      const ogDescription = yoastMeta.find(({ property }) => property === 'og:description')
      return ogDescription ? this.$options.filters.heDecode(ogDescription.content) : ''
    },
    seoMetaProperties(metadata, noIndex = false) {
      const seoMetaProperties = noIndex ? [{ name: 'robots', content: 'noindex' }, ...metadata] : metadata
      const metaProperties = seoMetaProperties.map((metaProperty) => {
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
      metadataUpdateHelper('og:url', location.href, 'property')

      // add twitter missing meta data
      metadataUpdateHelper('twitter:site', location.href)
      const image = metaProperties.find(({ property }) => property === 'og:image')
      metadataUpdateHelper('twitter:image', image ? image.content : `${location.href}/logo.png`)

      return metaProperties
    },
    jsonLDScript(...additionnalContext) {
      const companyContext = {
        '@context': 'http://www.schema.org',
        '@type': 'Organization',
        name: 'La Chouquette',
        url: location.href,
        logo: `${location.href}/logo.png`,
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
        url: location.href,
        sameAs: ['https://www.facebook.com/lachouquettelausanne', 'https://www.instagram.com/lachouquette.ch/?hl=fr'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${location.href}/search/{search_term}`,
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
