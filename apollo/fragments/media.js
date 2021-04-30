import gql from 'graphql-tag'

export const media = gql`
  fragment MediaFragments on Media {
    id
    alt
    source
    sizes {
      name
      image {
        width
        height
        url
      }
    }
  }
`
