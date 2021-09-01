import gql from 'graphql-tag'

import { media as MediaParts } from '@/apollo/fragments/media'
import { seo as SeoParts } from '@/apollo/fragments/seo'

export const fiche = gql`
  fragment FicheFragments on Fiche {
    id
    slug
    title
    date
    content
    isChouquettise
    address

    principalCategoryId
    categoryIds
    locationId
    valueIds

    info {
      mail
      telephone
      website
      facebook
      instagram
      cost
      openings
    }
    logo {
      slug
      name
      url
    }
    image {
      ...MediaFragments
    }
    criteria {
      name
      values {
        id
        name
      }
    }
    poi {
      address
      lat
      lng
      marker
    }
    seo {
      ...SeoFragments
    }
  }
  ${MediaParts}
  ${SeoParts}
`
