import gql from 'graphql-tag'

export const avatar = gql`
  fragment AvatarFragments on Avatar {
    size24
    size48
    size96
  }
`

export const author = gql`
  fragment AuthorFragments on Author {
    id
    slug
    name
    description
    avatar {
      size24
      size48
      size96
    }
  }
`
