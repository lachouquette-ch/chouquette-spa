import gql from 'graphql-tag'

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
