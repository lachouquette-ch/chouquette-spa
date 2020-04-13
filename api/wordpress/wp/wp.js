import Repository from './repository'
import CommentRepository from './comments'

function wpEndpointFactory($axios) {
  return {
    categories: new Repository('categories', $axios),
    comments: new CommentRepository($axios),
    fiches: new Repository('fiches', $axios),
    media: new Repository('media', $axios),
    posts: new Repository('posts', $axios)
  }
}

export { wpEndpointFactory }
