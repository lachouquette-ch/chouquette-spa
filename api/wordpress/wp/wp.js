import Repository from './repository'
import CommentRepository from './comments'
import FicheRepository from './fiches'
import UserRepository from './users'
import PostRepository from '~/api/wordpress/wp/posts'
import MediaRepository from '~/api/wordpress/wp/media'

function wpEndpointFactory($axios) {
  return {
    categories: new Repository('categories', $axios),
    comments: new CommentRepository($axios),
    fiches: new FicheRepository($axios),
    media: new MediaRepository($axios),
    posts: new PostRepository($axios),
    pages: new Repository('pages', $axios),
    users: new UserRepository($axios),
    tags: new Repository('tags', $axios),
    locations: new Repository('locations', $axios)
  }
}

export { wpEndpointFactory }
