import gql from 'graphql-tag'

export const comment = gql`
  fragment CommentFragments on Comment {
    id
    parentId
    authorId
    authorName
    authorAvatar
    date
    content
  }
`
