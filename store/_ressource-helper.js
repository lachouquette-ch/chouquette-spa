import _ from 'lodash'

/* States */

export const ressourceStates = () => ({
  all: {}
})

/* Actions */

const fetchByIds = async (ressourceRepository, mutationName, { commit, state }, ids) => {
  const unknownIds = _.difference(ids, Object.keys(state.all))
  const newRessources = await ressourceRepository.getByIds(unknownIds)
  commit(mutationName, newRessources)

  return ids.map((id) => state.all[id])
}

const fetchById = async (ressourceRepository, mutationName, { commit, state }, id) => {
  if (state.all[id]) {
    return Promise.resolve(state.all[id])
  } else {
    const ressource = await ressourceRepository.getById(id)
    commit(mutationName, ressource)
    return ressource
  }
}

const fetchBySlug = async (ressourceRepository, mutationName, { commit, state }, slug) => {
  const ressource = await ressourceRepository.getBySlug(slug)
  commit(mutationName, ressource)
  return ressource
}

export const ressourceActions = { fetchById, fetchByIds, fetchBySlug }

/* Mutations */

const setRessources = (state, ressources) => {
  ressources.forEach((ressource) => (state.all[ressource.id] = ressource))
}
const setRessource = (state, ressource) => {
  state.all[ressource.id] = ressource
}

export const ressourceMutations = { setRessource, setRessources }
