<!--
  - Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
  - This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  - You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <h1 class="text-center mb-5">
      Désolé, ce contenu a été supprimé de notre site... <i class="far fa-trash-alt"></i>
    </h1>
    <p>
      Retourne sur la <nuxt-link to="/">page d'accueil</nuxt-link> et découvre nos dernières nouveautés
      <i class="far fa-smile-wink"></i>
    </p>
    <p>Ou dis nous ce que tu cherches :</p>
    <Search />
  </div>
</template>

<script>
import Search from '~/components/Search'

export default {
  components: { Search },
}
</script>

<style scoped>
a {
  text-decoration: underline;
}
</style>
