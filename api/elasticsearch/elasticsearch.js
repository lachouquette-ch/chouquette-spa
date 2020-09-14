const geohash = require('ngeohash')

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

  async searchMarkers(latLnbBounds, zoom) {
    let precision
    if (zoom < 10) {
      precision = 5
    } else if (zoom < 14) {
      precision = 6
    } else if (zoom < 16) {
      precision = 7
    } else if (zoom < 18) {
      precision = 8
    } else {
      precision = 11
    }
    // eslint-disable-next-line no-console
    console.debug('zoom', zoom, 'precision', precision)

    const {
      aggregations: {
        map: { buckets },
      },
    } = await this.$axios.$post(`${Repository.fichesIndex}/_search`, {
      _source: false,
      size: 0,
      query: {
        bool: {
          filter: [
            {
              exists: {
                field: 'location.position',
              },
            },
            {
              geo_bounding_box: {
                'location.position': {
                  top: latLnbBounds.north,
                  left: latLnbBounds.west,
                  bottom: latLnbBounds.south,
                  right: latLnbBounds.east,
                },
              },
            },
          ],
        },
      },
      aggregations: {
        map: {
          geohash_grid: {
            field: 'location.position',
            precision,
          },
          aggregations: {
            data: {
              scripted_metric: {
                init_script:
                  'state.now = ZonedDateTime.parse(params.now); state.count = 0; state.chouquettise = false; state.id = 0; state.name = null; state.marker_icon = null;',
                map_script:
                  'if (state.chouquettise === false && doc.chouquettise_end.size() > 0 && doc.chouquettise_end.value.isAfter(state.now)) { state.chouquettise = true; } if (state.count++ === 0) { state.id = params._source.id; state.name = params._source.title; state.marker_icon = state.chouquettise ? params._source.marker_icon_chouquettise : params._source.marker_icon; } else { state.id = null; state.name = null; state.marker_icon = null; }',
                combine_script: 'return state',
                reduce_script:
                  "Map result = new HashMap(); result['chouquettise'] = states.stream().anyMatch(state -> state.chouquettise === true); if (states.size() === 1) { def state = states.get(0); if (state.count === 1) { result['id'] = state.id; result['name'] = state.name; result['marker_icon'] = state.marker_icon; } } return result;",
                params: {
                  now: '2020-08-04T08:36:28.446Z',
                },
              },
            },
          },
        },
      },
    })

    const result = buckets.map((bucket) => {
      const bbox = geohash.decode_bbox(bucket.key)
      const coord = geohash.decode(bucket.key)
      return { count: bucket.doc_count, bbox, coord, ...bucket.data.value }
    })
    return result
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
