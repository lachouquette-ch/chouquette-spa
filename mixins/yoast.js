export default {
  methods: {
    yoastMetaConfig(yoastMeta) {
      return yoastMeta.map((metaProperty) => {
        return {
          ...metaProperty,
          content: this.$options.filters.heDecode(metaProperty.content),
          hid: metaProperty.name || metaProperty.property
        }
      })
    },
    yoastJsonLDConfig(yoastJsonLD) {
      return yoastJsonLD.map((jsonLD) => {
        return { type: 'application/ld+json', json: jsonLD }
      })
    }
  }
}
