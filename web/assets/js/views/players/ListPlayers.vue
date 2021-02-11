<template>
  <div>
    <section class="hero has-text-centered has-no-background">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Hypixel SkyBlock Player Leaderboard</h1>
          <h2 class="subtitle">Currently tracking {{ formatNumber(stats.players) }} players with {{ formatNumber(stats.players_metrics) }} metrics!</h2>

          <router-link :to="{ name: 'landing-page' }" class="button">
            <span class="icon is-small">
              <i class="fas fa-arrow-alt-circle-left"></i>
            </span>
            <span>Return to welcome notes</span>
          </router-link>
        </div>
      </div>
    </section>

    <div class="columns">
      <div class="column">
        <input type="text" class="input is-large" placeholder="Enter the username of a player here to find their stats" v-model="username" />
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="box" v-if="players.length > 0">
          <table class="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Guild</th>
                <th>Weight</th>
                <th class="is-clickable" @click="clickSort('average_skill_progress')">
                  Average Skills
                  <sort-button v-show="sorter == 'average_skill_progress'" :sort="false" />
                </th>
                <th class="is-clickable" @click="clickSort('total_slayer')">
                  Total Slayer
                  <sort-button v-show="sorter == 'total_slayer'" :sort="false" />
                </th>
                <th class="is-clickable">
                  <div class="select is-small">
                    <select @change="selectCustomSort">
                      <option v-for="name of Object.keys(sortableColumns)" :key="name" :value="name" :selected="customValue == name">
                        {{ name }}
                      </option>
                    </select>
                  </div>
                  <sort-button v-show="sorter == sortableColumns[customValue]" :sort="false" />
                </th>
                <th>Last updated</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(player, index) of players" @click="clickPlayer(player)">
                <th>{{ formatNumber(player.rank) }}</th>
                <td>{{ player.username }}</td>
                <td>{{ player.guild_name }}</td>
                <td>
                  <span class="tag is-purple">{{ player.raw_weight.total == null ? 0 : formatNumber(player.raw_weight.total.toFixed(2)) }}</span>
                </td>
                <td>
                  <div class="tags has-addons">
                    <span class="tag is-info">{{ formatNumber(player.average_skill_progress, 2) }}</span>
                    <span class="tag is-primary">{{ formatNumber(player.average_skill, 2) }}</span>
                  </div>
                </td>
                <td>
                  <span class="tag is-danger">{{ formatNumber(player.total_slayer) }}</span>
                </td>
                <td>
                  <span
                    class="tag is-success"
                    :class="{
                      'is-success': player.custom_value > 0,
                      'is-warning': player.custom_value == -1,
                    }"
                    >{{ player.custom_value == -1 ? 'API DISABLED' : player.custom_value }}</span
                  >
                </td>
                <td>
                  {{ player.last_updated_at_humanized }}
                </td>
              </tr>
            </tbody>
          </table>

          <pagination v-if="paginate != null" :pagination="paginate" @go-to-page="handlePaginationNavigation" />
        </div>

        <div class="box has-text-centered" v-else>
          <p class="subtitle">
            Found no player with the username of
            <strong
              ><i>{{ username }}</i></strong
            >
            on the leaderboard!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SortButton from '@components/SortButton'
import Pagination from '@components/Pagination'
import Loading from '@components/Loading'
import Store from '@/store'
import moment from 'moment'

export default {
  components: {
    SortButton,
    Pagination,
    Loading,
  },

  mounted() {
    let currentPage = parseInt(new URLSearchParams(window.location.search).get('page'))
    if (!isNaN(currentPage)) {
      this.page = currentPage
    }

    this.loadPlayers()
  },

  data() {
    return {
      page: 1,
      sorter: 'average_skill_progress',
      customValue: 'Combat XP',
      username: '',
      usernameTimer: null,
      players: [],
      paginate: null,
      isLoading: false,
      sortableColumns: {
        Revenant: 'revenant_xp',
        Tarantula: 'tarantula_xp',
        Sven: 'sven_xp',
        Catacombs: 'catacomb',
        'Catacombs XP': 'catacomb_xp',
        Healer: 'healer',
        'Healer XP': 'healer_xp',
        Mage: 'mage',
        'Mage XP': 'mage_xp',
        Berserk: 'berserk',
        'Berserk XP': 'berserk_xp',
        Archer: 'archer',
        'Archer XP': 'archer_xp',
        Tank: 'tank',
        'Tank XP': 'tank_xp',
        Mining: 'mining',
        'Mining XP': 'mining_xp',
        Foraging: 'foraging',
        'Foraging XP': 'foraging_xp',
        Enchanting: 'enchanting',
        'Enchanting XP': 'enchanting_xp',
        Farming: 'farming',
        'Farming XP': 'farming_xp',
        Combat: 'combat',
        'Combat XP': 'combat_xp',
        Fishing: 'fishing',
        'Fishing XP': 'fishing_xp',
        Alchemy: 'alchemy',
        'Alchemy XP': 'alchemy_xp',
        Taming: 'taming',
        'Taming XP': 'taming_xp',
        Carpentry: 'carpentry',
        'Carpentry XP': 'carpentry_xp',
        Runecrafting: 'runecrafting',
        'Runecrafting XP': 'runecrafting_xp',
      },
    }
  },

  methods: {
    handlePaginationNavigation(page) {
      this.page = page

      history.pushState({ page }, `Page #${page}`, `?page=${page}`)

      this.loadPlayers()
    },

    loadPlayers() {
      if (this.isLoading) {
        return
      }

      this.isLoading = true

      let uri = `/players?perPage=25&page=${this.page}&sort=${this.sorter}`
      if (this.username.length > 1) {
        uri += '&username=' + this.username
      }

      let rankCounter = (this.page - 1) * 25 + 1
      axios.get(uri).then(response => {
        this.paginate = response.data.paginate
        this.players = response.data.data.map(player => {
          let value = player[this.sortableColumns[this.customValue]]
          player.custom_value = value == -1 ? -1 : this.formatNumber(value)

          player.rank = rankCounter++
          player.last_updated_at_humanized = moment(player.last_updated_at).toNow().split(' ').splice(1).join(' ') + ' ago'

          return player
        })
        this.isLoading = false
      })
    },

    selectCustomSort(event) {
      this.customValue = event.target.value

      this.clickSort(this.sortableColumns[event.target.value])
    },

    clickSort(method) {
      this.sorter = method

      this.loadPlayers()
    },

    clickPlayer(player) {
      this.$router.push({
        name: 'players.show',
        params: { uuid: player.uuid },
      })
    },
  },

  watch: {
    username(value) {
      clearTimeout(this.usernameTimer)
      this.usernameTimer = setTimeout(() => {
        this.loadPlayers()
      }, 500)
    },
  },

  computed: {
    stats() {
      return Store.get('stats')
    },
  },
}
</script>

<style lang="scss" scoped>
tbody > tr {
  cursor: pointer;
}
.select {
  &::after {
    top: 40% !important;
  }

  & select {
    color: #f2f2f2;
    background-color: #282f2f;
    position: relative;
    bottom: 4px;

    & option {
      background-color: #282f2f;
      color: #f2f2f2;
    }
  }
}
</style>
