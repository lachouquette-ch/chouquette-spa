export default {
  methods: {
    yoastMetaConfig(yoastMeta) {
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
    yoastJsonLDConfig(yoastJsonLD) {
      return yoastJsonLD.map((jsonLD) => {
        return { type: 'application/ld+json', json: jsonLD }
      })
    }
  }
}
