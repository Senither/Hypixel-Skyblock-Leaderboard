<template>
  <loading v-if="isLoading" :message="'Loading players data...'" />

  <div v-else>
    <div class="columns">
      <div class="column">
        <div class="tabs is-toggle is-fullwidth">
          <ul>
            <li
              @click="clickSort('average_skill_progress')"
              :class="{ 'is-active': this.sortMethod == 'average_skill_progress' }"
            >
              <a>Sort by Skills</a>
            </li>
            <li @click="clickSort('total_slayer')" :class="{ 'is-active': this.sortMethod == 'total_slayer' }">
              <a>Sort by Slayers</a>
            </li>
            <li @click="clickSort('catacomb_xp')" :class="{ 'is-active': this.sortMethod == 'catacomb_xp' }">
              <a>Sort by Catacombs</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <player v-for="(player, rank) of sortedPlayers" :player="player" :rank="rank + 1" :key="player.uuid" />
  </div>
</template>

<script>
import Loading from '@components/Loading'
import Player from '@components/Player'

export default {
  props: {
    id: String,
  },

  components: {
    Loading,
    Player,
  },

  mounted() {
    axios.get(`/players/${this.id}`).then(response => {
      this.players = response.data.data.map(player => {
        player.collaps = true

        return player
      })

      this.isLoading = false
    })
  },

  data() {
    return {
      isLoading: true,
      players: null,
      sortMethod: 'average_skill_progress',
    }
  },

  methods: {
    clickSort(method) {
      this.sortMethod = method
    },
  },

  computed: {
    sortedPlayers() {
      return this.players.sort((v1, v2) => {
        return v2[this.sortMethod] > v1[this.sortMethod] ? 1 : -1
      })
    },
  },
}
</script>
