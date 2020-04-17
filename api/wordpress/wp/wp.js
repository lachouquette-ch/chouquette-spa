import Repository from './repository'
import CommentRepository from './comments'
import FicheRepository from './fiches'

function wpEndpointFactory($axios) {
  return {
    categories: new Repository('categories', $axios),
    comments: new CommentRepository($axios),
    fiches: new FicheRepository($axios),
    media: new Repository('media', $axios),
    posts: new Repository('posts', $axios)
  }
}

export { wpEndpointFactory }
