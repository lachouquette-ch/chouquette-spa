import Repository from './repository'

class CommentRepository extends Repository {
  constructor($axios) {
    super('comments', $axios)
  }

  postComment(comment) {
    return this.$axios.post(this.prefix, comment)
  }

  getByPost(postId) {
    return this.get({
      post: postId,
      per_page: 100,
    })
  }
}

export default CommentRepository
