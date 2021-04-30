import gql from 'graphql-tag'

export const tag = gql`
  fragment TagFragments on Tag {
    id
    slug
    name
  }
`
