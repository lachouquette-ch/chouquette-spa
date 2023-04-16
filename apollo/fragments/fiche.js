/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import gql from 'graphql-tag'

import { media as MediaParts } from '@/apollo/fragments/media'
import { seo as SeoParts } from '@/apollo/fragments/seo'

export const fiche = gql`
  fragment FicheFragments on Fiche {
    id
    slug
    title
    date
    content
    isChouquettise
    address

    principalCategoryId
    categoryIds
    locationId
    valueIds

    info {
      mail
      telephone
      website
      facebook
      instagram
      cost
      openings
    }
    logo {
      slug
      name
      url
    }
    image {
      ...MediaFragments
    }
    categoryFilters {
      name
      values {
        id
        name
      }
    }
    poi {
      address
      lat
      lng
      marker
    }
    seo {
      ...SeoFragments
    }
  }
  ${MediaParts}
  ${SeoParts}
`
