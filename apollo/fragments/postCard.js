import gql from 'graphql-tag'

import { media as MediaParts } from '@/apollo/fragments/media'

export const postCard = gql`
  fragment PostCardFragments on PostCard {
    id
    slug
    date
    authorName
    title
    image {
      ...MediaFragments
    }
    categoryId
  }
  ${MediaParts}
`
