/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import gql from 'graphql-tag'
import { media as MediaFragments } from '@/apollo/fragments/media'

export const state = () => ({
  name: null,
  description: null,
  wordpressUrl: null,
  loadingPromise: null,
  labelPage: 'label-la-chouquettisation-ecoresponsable-chouquette-valeurs-suisse-romande-vaud-guide-local-ecologie',
})

export const actions = {
  async nuxtServerInit({ state, commit, dispatch }) {
    // avoid double initialization
    if (state.loadingPromise) return state.loadingPromise

    // eslint-disable-next-line no-undef
    const client = this.app.apolloProvider.defaultClient

    const nuxtServerInit = await client
      .query({
        query: gql`
          query {
            nuxtServerInit {
              settings {
                name
                description
                url
              }
              theme {
                systemText
              }
              redirects {
                from
                to
                status
              }
              categories {
                id
                slug
                name
                description
                parentId
                logoYellow {
                  ...MediaFragments
                }
                logoWhite {
                  ...MediaFragments
                }
                logoBlack {
                  ...MediaFragments
                }
              }
              menus {
                id
                name
                slug
                items {
                  id
                  type
                  slug
                  title
                }
              }
              locations {
                id
                parentId
                name
                slug
                description
              }
              values {
                id
                name
                slug
                description
                image {
                  ...MediaFragments
                }
              }
            }
          }
          ${MediaFragments}
        `,
      })
      .then(({ data }) => data.nuxtServerInit)

    const loadingPromise = Promise.all([
      commit('SET_SETTINGS', nuxtServerInit.settings),
      commit('SET_THEME', nuxtServerInit.theme),
      /* Init all stores */
      await dispatch('yoast/init', nuxtServerInit.redirects),
      await dispatch('categories/init', nuxtServerInit.categories),
      await dispatch('menus/init', nuxtServerInit.menus),
      await dispatch('locations/init', nuxtServerInit.locations),
      await dispatch('values/init', nuxtServerInit.values),
    ])
    commit('SET_LOADING', loadingPromise)
    return loadingPromise
  },
}

export const mutations = {
  SET_LOADING(state, loadingPromise) {
    state.loadingPromise = loadingPromise
  },
  SET_SETTINGS(state, { name, description, url, home }) {
    state.name = name
    state.description = description
    state.wordpressUrl = url
  },
  SET_THEME(state, { systemText }) {
    state.systemText = systemText
  },
}
