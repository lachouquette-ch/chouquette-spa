import gql from 'graphql-tag'

export const author = gql`
  fragment AuthorFragments on Author {
    id
    slug
    name
    description
    avatar
  }
`
