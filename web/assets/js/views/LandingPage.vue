<template>
  <div>
    <section class="hero has-text-centered has-no-background">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Hypixel SkyBlock Leaderboard</h1>
          <h2 class="subtitle">Welcome to the Hypixel SkyBlock leaderboard!</h2>

          <h5 class="title is-5">The leaderboard is tracking</h5>

          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Guilds</p>
                <p class="title">{{ formatNumber(stats.guilds) }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Guild Metrics</p>
                <p class="title">{{ formatNumber(stats.guilds_metrics) }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Players</p>
                <p class="title">{{ formatNumber(stats.players) }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Player Metrics</p>
                <p class="title">{{ formatNumber(stats.players_metrics) }}</p>
              </div>
            </div>
          </nav>

          <div class="columns">
            <div class="column">
              <router-card-button :name="'Guild Leaderboard'" :icon="'fas fa-landmark'" :go-to="'guilds'" />
            </div>
            <div class="column">
              <router-card-button :name="'Player Leaderboard'" :icon="'fas fa-users'" :go-to="'players'" />
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <h3 class="subtitle is-3 has-text-centered">Latest guild join & leave history</h3>

              <div class="box" v-if="history.length > 0">
                <table class="table is-striped is-hoverable is-fullwidth">
                  <tbody>
                    <tr v-for="record of history">
                      <td>
                        <span class="has-text-grey-light">
                          {{ record.created_at_short }}
                        </span>

                        <router-link
                          :to="{
                            name: 'history.player',
                            params: {
                              uuid: record.uuid,
                            },
                          }"
                        >
                          <span v-if="record.username == null || record.username.length == 0">
                            <i class="fas fa-spinner fa-spin"></i> <i>Resolving Username</i>
                          </span>
                          <span v-else>{{ record.username }}</span>
                        </router-link>

                        {{ record.type == 0 ? 'joined' : 'left' }}

                        <router-link
                          :to="{
                            name: 'history.guild',
                            params: {
                              id: record.guild_id,
                            },
                          }"
                          >{{ record.guild_name }}</router-link
                        >
                      </td>
                      <td class="has-text-grey-light has-text-right">{{ record.created_at_humanized }}</td>
                    </tr>
                  </tbody>
                </table>

                <pagination v-if="paginate != null" :pagination="paginate" @go-to-page="handlePaginationNavigation" />
              </div>

              <div class="box has-text-centered" v-else>
                <p>There are currently no player history to display!</p>
                <p>Try check back later.</p>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <h3 class="subtitle is-3 has-text-centered">Leaderboard Requirements</h3>
              <p>
                Guilds on the leaderboard must meet the requirements below to be added to the leaderboard. <br />If you
                think a guild meets the requirements that aren't already on the leaderboard, you can contact
                <a>Senither#0001</a> on Discord, or join the
                <a target="blank" href="http://discord.gg/UY7XJs9">Trouble Brewing</a> Discord server.
              </p>

              <br />

              <div class="columns">
                <div class="column">
                  <h4 class="subtitle is-4 has-text-centered">Join Requirements</h4>

                  <div class="box">
                    <p>A guild must meet these requirements to be added to the leaderboard.</p>

                    <br />

                    <nav class="level">
                      <div class="level-item has-text-centered">
                        <div>
                          <p class="heading">Average Skills</p>
                          <p class="title">30</p>
                        </div>
                      </div>
                      <div class="level-item has-text-centered">
                        <div>
                          <p class="heading">Average Slayer</p>
                          <p class="title">250K</p>
                        </div>
                      </div>
                      <div class="level-item has-text-centered">
                        <div>
                          <p class="heading">Catacombs</p>
                          <p class="title">15</p>
                        </div>
                      </div>
                      <div class="level-item has-text-centered">
                        <div>
                          <p class="heading">Members</p>
                          <p class="title">35</p>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
                <div class="column">
                  <h4 class="subtitle is-4 has-text-centered">Stay Requirements</h4>

                  <div class="box">
                    <p>A guild must meet these requirements to stay on the leaderboard.</p>

                    <br />

                    <nav class="level">
                      <div class="level-item has-text-centered">
                        <div>
                          <p class="heading">Average Skills</p>
                          <p class="title">25</p>
                        </div>
                      </div>
                      <div class="level-item has-text-centered">
                        <div>
                          <p class="heading">Average Slayer</p>
                          <p class="title">150K</p>
                        </div>
                      </div>
                      <div class="level-item has-text-centered">
                        <div>
                          <p class="heading">Catacombs</p>
                          <p class="title">12.5</p>
                        </div>
                      </div>
                      <div class="level-item has-text-centered">
                        <div>
                          <p class="heading">Members</p>
                          <p class="title">25</p>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>

              <br />

              <p>
                If a guild falls below the <strong>Stay requirements</strong>, they will have a grace period of
                <strong>5 days</strong> before being removed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import RouterCardButton from '@components/RouterCardButton'
import Pagination from '@components/Pagination'
import Store from '@/store'
import moment from 'moment'

export default {
  components: {
    RouterCardButton,
    Pagination,
  },

  mounted() {
    this.loadHistory()
  },

  data() {
    return {
      page: 1,
      isLoading: false,
      history: [],
      paginate: null,
    }
  },

  methods: {
    handlePaginationNavigation(page) {
      this.page = page

      this.loadHistory()
    },

    loadHistory() {
      if (this.isLoading) {
        return
      }

      this.isLoading = true

      axios.get(`/history?perPage=10&page=${this.page}`).then(response => {
        this.paginate = response.data.paginate
        this.history = response.data.data.map(record => {
          let createdAt = moment.utc(record.created_at)

          createdAt.local()

          record.created_at_short = createdAt.format('MMM Do, YYYY')
          record.created_at_humanized = createdAt.toNow().split(' ').splice(1).join(' ') + ' ago'

          return record
        })

        this.isLoading = false
      })
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
.title.is-5 {
  padding-top: 20px;
}
</style>
