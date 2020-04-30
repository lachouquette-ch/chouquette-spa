<template>
  <form id="app" action="action" @submit.prevent="search">
    <div class="form-row">
      <div class="p-0 px-md-1 mb-2" :class="filterCol">
        <select v-model="formSearch.location" class="form-control" title="Où veux-tu aller ?">
          <option :value="null">Où veux-tu aller ?</option>
          <option
            v-for="location in flatLocations"
            :key="location.id"
            :value="location"
            :class="{ 'font-weight-bold': !location.level }"
          >
            {{ '&nbsp;'.repeat(location.level * 2) }}{{ location.name }}
          </option>
        </select>
      </div>
      <div class="p-0 px-md-1 mb-2" :class="filterCol">
        <select v-model="formSearch.category" class="form-control" title="Qu'aimerais-tu faire ?">
          <option :value="null">Qu'aimerais-tu faire ?</option>
          <option v-for="category in categories" :key="category.id" :value="category">{{ category.name }}</option>
        </select>
      </div>
      <div class="p-0 px-md-1 mb-2" :class="filterCol">
        <input
          v-model="formSearch.searchText"
          class="form-control"
          type="text"
          placeholder="Un mot clef ?"
          name="searchName"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="col px-0">
        <button
          class="btn btn-primary d-block mx-auto py-2 px-5"
          :class="buttonClass"
          type="submit"
          :disabled="$v.formSearch.$invalid"
        >
          Rechercher
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    buttonClass: {
      type: String
    },
    filterCol: {
      type: String,
      default: 'col-md-4'
    }
  },
  data() {
    return {
      formSearch: {
        category: null,
        location: null,
        searchText: null
      }
    }
  },
  computed: {
    ...mapState('menus', {
      categories: 'headerCategories'
    }),
    ...mapState('locations', {
      locations: 'hierarchy'
    }),
    flatLocations() {
      // first level only
      return this.locations.reduce(
        (locations, { location, subLocations }) => [...locations, location, ...subLocations],
        []
      )
    }
  },
  validations: {
    formSearch: {
      oneField() {
        return !!this.formSearch.location || !!this.formSearch.category || !!this.formSearch.searchText
      }
    }
  },
  methods: {
    search() {
      if (!this.formSearch.$invalid) {
        const query = this.formSearch.searchText ? { s: this.formSearch.searchText } : {}
        if (this.formSearch.category) {
          if (this.formSearch.location) query.l = this.formSearch.location.slug
          this.$router.push({ path: `/category/${this.formSearch.category.slug}`, query })
        } else if (this.formSearch.location) {
          this.$router.push({ path: `/location/${this.formSearch.location.slug}`, query })
        } else {
          this.$router.push({ path: `/search/${this.formSearch.searchText}` })
        }
      }
    }
  }
}
</script>

<style scoped></style>
