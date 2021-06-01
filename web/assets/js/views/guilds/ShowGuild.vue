<template>
  <div>
    <section class="hero has-text-centered has-no-background" v-if="guild != null">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-1">{{ guild.name }} Overview</h1>

          <div class="is-centered" style="display: flex">
            <div class="field is-grouped is-centered is-grouped-multiline" style="margin: auto">
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Average Skill Progress</span>
                  <span class="tag is-info">
                    {{ formatNumber(guild.average_skill_progress) }}
                  </span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Average Skill</span>
                  <span class="tag is-primary">{{ formatNumber(guild.average_skill) }}</span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Slayer</span>
                  <span class="tag is-danger">{{ formatNumber(guild.average_slayer) }}</span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Catacomb</span>
                  <span class="tag is-success">{{ formatNumber(guild.average_catacomb) }}</span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Members</span>
                  <span class="tag is-warning">{{ formatNumber(guild.members) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="is-centered" style="display: flex">
            <div class="field is-grouped is-centered is-grouped-multiline" style="margin: auto">
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Total Weight</span>
                  <span class="tag is-purple">
                    {{ formatNumber(guild.weight.total) }}
                  </span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Skill Weight</span>
                  <span class="tag is-purple">
                    {{ formatNumber(guild.weight.skill) }}
                  </span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Slayer Weight</span>
                  <span class="tag is-purple">
                    {{ formatNumber(guild.weight.slayer) }}
                  </span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Catacomb Weight</span>
                  <span class="tag is-purple">
                    {{ formatNumber(guild.weight.catacomb) }}
                  </span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Weight Multiplier</span>
                  <span class="tag is-purple">
                    {{ weightMultiplier }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div class="columns" v-if="guild.meta.hasOwnProperty('hidden')">
            <div class="column">
              <div class="notification is-danger" style="max-width: 50vw; margin: auto">
                This guild has been hidden from the guild leaderboard, however players in the guild will still show up on the player leaderboard.
              </div>
            </div>
          </div>

          <div class="columns" v-if="hasSocials">
            <div class="column">
              <a
                v-if="guild.meta.hasOwnProperty('discord')"
                :href="'https://discord.gg/' + guild.meta.discord"
                class="button"
                target="blank"
                style="background-color: #8b9bd4"
              >
                <span class="icon is-small">
                  <i class="fab fa-discord"></i>
                </span>
                <span>Join Guild Discord</span>
              </a>

              <hr />
            </div>
          </div>

          <div class="columns">
            <div class="column has-text-centered">
              <h2 class="subtitle">
                <router-link :to="{ name: 'guilds' }" class="button">
                  <span class="icon is-small">
                    <i class="fas fa-arrow-alt-circle-left"></i>
                  </span>
                  <span>Return to guild list</span>
                </router-link>

                &nbsp;&nbsp;&nbsp;

                <router-link :to="{ name: 'history.guild', params: { ids: this.guild.id } }" class="button">
                  <span>View History</span>
                  <span class="icon is-small">
                    <i class="fas fa-align-right"></i>
                  </span>
                </router-link>

                &nbsp;&nbsp;&nbsp;

                <router-link :to="{ name: 'guilds.compare', params: { ids: this.guild.id } }" class="button">
                  <span>Compare guild metrics</span>
                  <span class="icon is-small">
                    <i class="fas fa-chart-pie"></i>
                  </span>
                </router-link>

                &nbsp;&nbsp;&nbsp;

                <div class="dropdown is-right" :class="{ 'is-active': showDownload }">
                  <div class="dropdown-trigger" @click="showDownload = !showDownload">
                    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu6">
                      <span class="icon is-small" v-if="isDownloading">
                        <i class="fas fa-spinner fa-pulse" aria-hidden="true"></i>
                      </span>
                      <span>Download Stats</span>
                      <span class="icon is-small">
                        <i class="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu6" role="menu">
                    <div class="dropdown-content">
                      <div class="dropdown-item">
                        <p>Select the values you wanna download.</p>
                      </div>
                      <hr class="dropdown-divider" />

                      <div class="dropdown-item">
                        <label class="checkbox">
                          <input type="checkbox" v-model="downloadOptions.weight" />
                          Weight
                        </label>

                        <label class="checkbox" style="margin-left: 4px">
                          <input type="checkbox" v-model="downloadOptions.skills" />
                          Skills
                        </label>
                      </div>

                      <div class="dropdown-item">
                        <label class="checkbox">
                          <input type="checkbox" v-model="downloadOptions.slayers" />
                          Slayers
                        </label>

                        <label class="checkbox" style="margin-left: 4px">
                          <input type="checkbox" v-model="downloadOptions.catacombs" />
                          Catacombs
                        </label>
                      </div>

                      <hr class="dropdown-divider" />
                      <a @click="download" class="dropdown-item"> Download as CSV </a>
                    </div>
                  </div>
                </div>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div>
      <div class="tabs is-large is-centered">
        <ul>
          <li :class="{ 'is-active': selectedView == views.PLAYERS }" @click="selectView(views.PLAYERS)">
            <a>Players</a>
          </li>
          <li :class="{ 'is-active': selectedView == views.METRICS }" @click="selectView(views.METRICS)">
            <a>Metrics</a>
          </li>
        </ul>
      </div>

      <div v-if="selectedView == views.METRICS">
        <guild-metrics :id="guild.id" />
      </div>

      <div v-else-if="selectedView == views.PLAYERS">
        <guild-players :id="guild.id" />
      </div>
    </div>
  </div>
</template>

<script>
import GuildPlayers from './partials/GuildPlayers'
import GuildMetrics from './partials/GuildMetrics'
import Store from '@/store'

export default {
  components: {
    GuildPlayers,
    GuildMetrics,
  },

  mounted() {
    if (this.guild == null) {
      return this.$router.push({
        name: 'guilds',
      })
    }
  },

  data() {
    return {
      isLoading: true,
      isDownloading: false,
      showDownload: false,
      selectedView: 0,
      views: {
        PLAYERS: 0,
        METRICS: 1,
      },
      downloadOptions: {
        weight: true,
        skills: false,
        slayers: false,
        catacombs: false,
      },
    }
  },

  methods: {
    selectView(view) {
      this.selectedView = view
    },

    download() {
      if (this.isDownloading) {
        return
      }

      this.isDownloading = true
      let csvHeaders = ['Username']

      for (let option of Object.keys(this.downloadOptions)) {
        if (this.downloadOptions[option]) {
          if (this.downloadOptions[option]) {
            switch (option) {
              case 'weight':
                csvHeaders.push('Weight')
                break

              case 'skills':
                csvHeaders.push('Average Skill')
                csvHeaders.push('Average Skill Progress')
                break

              case 'slayers':
                csvHeaders.push('Total Slayer')
                csvHeaders.push('Revenant XP')
                csvHeaders.push('Tarantula XP')
                csvHeaders.push('Sven XP')
                break

              case 'catacombs':
                csvHeaders.push('Catacombs Level')
                csvHeaders.push('Catacombs XP')
                break
            }
          }
        }
      }

      if (csvHeaders.length == 1) {
        this.isDownloading = false

        return alert('No options is selected! You must select at least one option to download the data')
      }

      axios
        .get(`/players/${this.guild.id}`)
        .then(response => {
          const players = response.data.data
          let csvData = [csvHeaders]

          for (let player of players) {
            let csvPlayer = [player.username]

            for (let option of Object.keys(this.downloadOptions)) {
              if (this.downloadOptions[option]) {
                switch (option) {
                  case 'weight':
                    csvPlayer.push(player.weight)
                    break

                  case 'skills':
                    csvPlayer.push(player.average_skill)
                    csvPlayer.push(player.average_skill_progress)
                    break

                  case 'slayers':
                    csvPlayer.push(player.total_slayer)
                    csvPlayer.push(player.revenant_xp)
                    csvPlayer.push(player.tarantula_xp)
                    csvPlayer.push(player.sven_xp)
                    break

                  case 'catacombs':
                    csvPlayer.push(player.catacomb)
                    csvPlayer.push(player.catacomb_xp)
                    break
                }
              }
            }

            csvData.push(csvPlayer)
          }

          let csv = ''
          for (let line of csvData) {
            csv += line.join(',') + '\n'
          }

          const hiddenElement = document.createElement('a')
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
          hiddenElement.target = '_blank'
          hiddenElement.download = this.guild.name + '-' + this.guild.last_updated_at.split('T')[0] + '.csv'
          hiddenElement.click()

          this.isDownloading = false
        })
        .catch(() => (this.isDownloading = false))
    },
  },

  computed: {
    guild() {
      const id = this.$route.params.id

      let guild = Store.get('guilds').filter(guild => {
        return guild.id == id
      })

      return guild.length == 0 ? null : guild[0]
    },

    hasSocials() {
      const { meta } = this.guild

      // Can add more social links here so all of them
      // can be checked for at the same time.

      return meta.hasOwnProperty('discord')
    },

    weightMultiplier() {
      if (this.guild == null) {
        return '??'
      }

      let multiplier = this.guild.weight.multiplier
      let parts = this.formatNumber(multiplier * 100, 2)
        .split(',')[0]
        .split('.')

      if (parts[1] == '00') {
        return parts[0] + '%'
      }

      return parts.join('.') + '%'
    },
  },
}
</script>
