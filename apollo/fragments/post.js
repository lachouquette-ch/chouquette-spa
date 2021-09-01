import gql from 'graphql-tag'

import { media as MediaParts } from '@/apollo/fragments/media'
import { tag as TagParts } from '@/apollo/fragments/tag'
import { author as AuthorParts } from '@/apollo/fragments/author'
import { seo as SeoParts } from '@/apollo/fragments/seo'

export const post = gql`
  fragment PostFragments on Post {
    id
    slug
    title
    date
    modified
    content
    ficheIds
    image {
      ...MediaFragments
    }
    tags {
      ...TagFragments
    }
    authors {
      ...AuthorFragments
    }
    seo {
      ...SeoFragments
    }
  }
  ${MediaParts}
  ${TagParts}
  ${AuthorParts}
  ${SeoParts}
`
