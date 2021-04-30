import gql from 'graphql-tag'

export const seo = gql`
  fragment SeoFragments on Seo {
    title
    metadata
    jsonLD
  }
`
