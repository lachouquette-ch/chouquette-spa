import gql from 'graphql-tag'

export const SETTINGS = gql`
  query Settings {
    settings {
      description
      name
      url
    }
  }
`

gql`
  fragment MediaParts on Media {
    id
    alt
    sizes {
      size
      info {
        width
        height
        url
      }
    }
  }
`