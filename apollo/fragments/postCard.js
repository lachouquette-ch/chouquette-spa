import gql from 'graphql-tag'

import { media as MediaParts } from '@/apollo/fragments/media'

export const postCard = gql`
  fragment PostCardFragments on PostCard {
    id
    slug
    date
    modified
    authorName
    title
    isTop
    image {
      ...MediaFragments
    }
    categoryId
  }
  ${MediaParts}
`
