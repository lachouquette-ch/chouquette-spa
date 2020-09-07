class Repository {
  static fichesIndex = 'wp-fiches'
  static postsIndex = 'wp-posts'

  constructor($axios) {
    this.$axios = $axios
  }

  async searchFichesByText(text) {
    const {
      hits: { hits: result },
    } = await this.$axios.$post(`${Repository.fichesIndex}/_search`, {
      // _source: ['_id', 'title', 'categories.name', 'criteria.term_name', 'location.address'],
      query: {
        multi_match: {
          query: text,
          fields: [
            'localisation.name^5',
            'categories.name^5',
            'tags.name^5',
            'critaria.term_name^5',

            'location.address^3',
            'yoast_focus_kw^3',
            'yoast_meta_desc^3',

            'title',
            'slug',
            'content',
          ],
          fuzziness: 'AUTO',
          prefix_length: 3,
        },
      },
    })

    const fiches = result.map(({ _source }) => _source)
    return fiches
  }

  async searchFichesByCriteria(termList) {
    console.log(termList)
    const termMap = termList.map(({ taxonomy, value }) => {
      return {
        term: {
          'criteria.criteria_term': `${taxonomy}_${value}`,
        },
      }
    })
    const {
      hits: { hits: result },
    } = await this.$axios.$post(`${Repository.fichesIndex}/_search`, {
      // _source: ['_id', 'title', 'categories.name', 'criteria.term_name', 'location.address'],
      _source: ['title', 'chouquettise_end'],
      sort: [{ chouquettise_end: { order: 'desc', missing: '_last' } }, '_score'],
      query: {
        bool: {
          filter: termMap,
        },
      },
    })

    const fiches = result.map(({ _source }) => _source)
    return fiches
  }

  async searchPostsByText(text) {
    const {
      hits: { hits: result },
    } = await this.$axios.$post(`${Repository.postsIndex}/_search`, {
      _source: {
        excludes: 'content',
      },
      query: {
        multi_match: {
          query: text,
          fields: [
            'tags.name^5',
            'categories.name^5',
            'yoast_focus_kw^5',
            'yoast_meta_desc^5',

            'title^3',
            'slug^3',
            'content',
          ],
          fuzziness: 'AUTO',
          prefix_length: 3,
        },
      },
      highlight: {
        fields: {
          title: {},
        },
      },
    })

    const posts = result.map(({ _source }) => _source)
    return posts
  }
}

export default Repository
