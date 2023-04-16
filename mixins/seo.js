/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

export default {
  computed: {
    currentURL() {
      return `${this.$config.siteUrl}${this.$route.fullPath}`
    },
  },
  methods: {
    seoGetDescription(yoastMeta) {
      const ogDescription = yoastMeta.find(({ property }) => property === 'og:description')
      return ogDescription ? this.$options.filters.heDecode(ogDescription.content) : ''
    },
    seoMetaProperties(metadata) {
      const metaProperties = metadata.map((metaProperty) => {
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
      metadataUpdateHelper('twitter:site', this.$config.siteUrl)
      const image = metaProperties.find(({ property }) => property === 'og:image')
      metadataUpdateHelper('twitter:image', image ? image.content : `${this.$config.siteUrl}/logo.png`)

      return metaProperties
    },
    jsonLDScript(...additionnalContext) {
      const companyContext = {
        '@context': 'http://www.schema.org',
        '@type': 'Organization',
        name: 'La Chouquette',
        url: this.$config.siteUrl,
        logo: `${this.$config.siteUrl}/logo.png`,
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
        url: this.$config.siteUrl,
        sameAs: ['https://www.facebook.com/lachouquettelausanne', 'https://www.instagram.com/lachouquette.ch/?hl=fr'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${this.$config.siteUrl}/search/{search_term}`,
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
