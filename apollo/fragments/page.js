import gql from 'graphql-tag'

import { seo as SeoParts } from '@/apollo/fragments/seo'

export const page = gql`
  fragment PageFragments on Page {
    id
    slug
    title
    date
    modified
    content
    seo {
      ...SeoFragments
    }
  }
  ${SeoParts}
`
