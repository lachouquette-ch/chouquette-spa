import WordpressEndpoint from './wordpressEndpoint'

class WordpressCommentEndpoint extends WordpressEndpoint {
  constructor() {
    super('comments')
  }

  postComment(comment) {
    return this.axios.post('/', comment)
  }

  getByPost(postId) {
    return this.get({
      post: postId,
      per_page: 100
    })
  }
}

export default new WordpressCommentEndpoint()
