import gql from 'graphql-tag'
import { media as MediaFragments } from '@/apollo/fragments/media'

export const state = () => ({
  name: null,
  description: null,
  wordpressUrl: null,
})

export const actions = {
  async nuxtServerInit({ state, commit, dispatch }) {
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
              redirects {
                from
                to
                status
              }
              categories {
                id
                name
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
            }
          }
          ${MediaFragments}
        `,
      })
      .then(({ data }) => data.nuxtServerInit)

    commit('SET_SETTINGS', nuxtServerInit.settings)
    /* Init all stores */
    await dispatch('yoast/init', nuxtServerInit.redirects)
    await dispatch('categories/init', nuxtServerInit.categories)
    await dispatch('menus/init', nuxtServerInit.menus)
    await dispatch('locations/init', nuxtServerInit.locations)
  },
}

export const mutations = {
  SET_SETTINGS(state, { name, description, url, home }) {
    state.name = name
    state.description = description
    state.wordpressUrl = url
  },
}
