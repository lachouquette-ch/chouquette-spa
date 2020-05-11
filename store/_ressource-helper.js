import _ from 'lodash'

/* States */

export const ressourceStates = () => ({
  all: {}
})

/* Actions */

/**
 * Try to get ressources from store (camche). Fetch missing ressources if any, store them and fetch its related ressources
 */
const fetchByIds = async (ressourceRepository, mutationName, { dispatch, commit, state }, ids) => {
  // find which keys aren't in store
  const unknownIds = _.differenceBy(_.uniq(ids), Object.keys(state.all), parseInt)
  if (!_.isEmpty(unknownIds)) {
    // fetch those missing ressources and add to store
    const newRessources = await ressourceRepository.getByIds(unknownIds).then(({ data }) => data)
    commit(mutationName, newRessources)

    // fetch related ressources
    await dispatch('fetchRelatedRessources', newRessources)
  }

  return ids.map((id) => state.all[id])
}

/**
 * Try to get ressource from store (cache). Fetch if not, add to store and fetch also related ressources
 */
const fetchById = async (ressourceRepository, mutationName, { dispatch, commit, state }, id) => {
  // try to use cache first
  if (state.all[id]) {
    return state.all[id]
  } else {
    // fetch ressource and add to store
    const ressource = await ressourceRepository.getById(id).then(({ data }) => data)
    commit(mutationName, ressource)

    // fetch related ressources
    await dispatch('fetchRelatedRessources', [ressource])

    return ressource
  }
}

/**
 * Fetch ressource by slug, add to store and fetch its related ressources
 */
const fetchBySlug = async (ressourceRepository, mutationName, { dispatch, commit, state }, slug) => {
  const ressource = await ressourceRepository.getBySlug(slug).then(({ data }) => data[0])
  commit(mutationName, ressource)

  // fetch related ressources
  await dispatch('fetchRelatedRessources', [ressource])

  return ressource
}

export const ressourceActions = { fetchById, fetchByIds, fetchBySlug }

/* Mutations */

const setRessources = (state, ressources) => {
  ressources.forEach((ressource) => {
    state.all[ressource.id] = ressource
  })
}
const setRessource = (state, ressource) => {
  state.all[ressource.id] = ressource
}

export const ressourceMutations = { setRessource, setRessources }
