import gql from 'graphql-tag'

export const SETTINGS = gql`
  query settings {
    settings {
      description
      name
      url
    }
  }
`
