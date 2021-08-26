import gql from 'graphql-tag'

import { media as MediaParts } from '@/apollo/fragments/media'

export const ficheCard = gql`
  fragment FicheCardFragments on FicheCard {
    id
    slug
    title
    isChouquettise

    principalCategoryId
    locationId

    image {
      ...MediaFragments
    }
  }
  ${MediaParts}
`
