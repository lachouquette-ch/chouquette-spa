/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
