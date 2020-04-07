import WordpressEndpoint from './wordpressEndpoint'

class WordpressCommentEndpoint extends WordpressEndpoint {
  constructor() {
    super('comments')
  }

  postComment(comment) {
    return this.axios.post('/', comment)
  }
}

export default new WordpressCommentEndpoint()
