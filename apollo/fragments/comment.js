import gql from 'graphql-tag'

import { avatar as AvatarFragments } from '@/apollo/fragments/author'

export const comment = gql`
  fragment CommentFragments on Comment {
    id
    parentId
    authorId
    authorName
    authorAvatar {
      ...AvatarFragments
    }
    date
    content
  }
  ${AvatarFragments}
`
