import gql from 'graphql-tag'

import { media as MediaParts } from '@/apollo/fragments/media'

export const ficheCard = gql`
  fragment FicheCardFragments on Fiche {
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

    image {
      ...MediaFragments
    }
    poi {
      address
      lat
      lng
      marker
    }
  }
  ${MediaParts}
`
