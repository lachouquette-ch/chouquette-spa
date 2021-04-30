import gql from 'graphql-tag'

import { seo as SeoParts } from '@/apollo/fragments/seo'

export const page = gql`
  fragment PostFragments on Post {
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
