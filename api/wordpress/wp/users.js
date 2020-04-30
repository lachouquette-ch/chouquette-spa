import Repository from './repository'

class UserRepository extends Repository {
  constructor($axios) {
    super('users', $axios)
  }

  getTeam() {
    return this.$axios.get(this.prefix + '/team')
  }
}

export default UserRepository
