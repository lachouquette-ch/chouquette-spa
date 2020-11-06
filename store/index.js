import { SETTINGS } from '@/api/graphql/wordpress'

export const actions = {
  async nuxtServerInit({ state, commit, dispatch }) {
    const client = this.app.apolloProvider.defaultClient
    client.query({
      query: SETTINGS,
    })

    /* Fetch yoast redirect */
    await dispatch('yoast/init')

    /* Fetch Layout component data */

    // fetch menus
    await dispatch('menus/init')
    // fetch locations
    await dispatch('locations/init')
  },
}
