<template>
  <div>
    <div class="container">
      <transition-page v-if="announcement.enabled">
        <div class="notification is-primary" style="margin-top: 28px">
          <div class="columns is-vcentered">
            <svg height="45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              ></path>
            </svg>

            <div class="column">
              <p>
                <strong>{{ announcement.title }}</strong>
              </p>
              <p v-html="announcement.message"></p>
            </div>
          </div>
        </div>
      </transition-page>

      <transition-page>
        <loading v-if="isLoading" :message="message" />

        <router-view v-else></router-view>
      </transition-page>
    </div>

    <transition-page :type="'slide-from-bottom'">
      <footer class="footer" v-if="!isLoading">
        <div class="content has-text-centered">
          <!-- prettier-ignore -->
          <p>
            Created by <a href="https://senither.com/">Alexis Tan</a>,
            powered by <a href="https://bulma.io/">Bulma</a>,
            <a href="https://vuejs.org/">VueJS</a>,
            <a href="https://apexcharts.com/">ApexCharts</a>, and
            <a href="https://m.do.co/c/9f589c4101c3">DigitalOcean</a>,
            theme by <a href="https://jenil.github.io/bulmaswatch/">Bulmaswatch</a>.
            <br />Get the <a href="https://github.com/Senither/Hypixel-Skyblock-Leaderboard">source code</a> on
            <a href="https://github.com/Senither/Hypixel-Skyblock-Leaderboard">GitHub</a>.
          </p>
        </div>
      </footer>
    </transition-page>
  </div>
</template>

<script>
import TransitionPage from '@components/TransitionPage'
import Loading from '@components/Loading'

import Store from '@/store'

export default {
  components: {
    TransitionPage,
    Loading,
  },

  mounted() {
    axios
      .get('/stats')
      .then(response => {
        Store.put('stats', response.data.data)

        this.message = 'Loading guilds...'

        return axios.get('/')
      })
      .then(response => {
        this.message = 'Calculating ranks...'

        // Sets skill guild ranks
        let guildRank = 1
        let guilds = response.data.data
          .sort((v1, v2) => {
            return v2.average_skill_progress > v1.average_skill_progress ? 1 : -1
          })
          .map((guild, index) => {
            if (guild.meta.hasOwnProperty('hidden')) {
              return guild
            }

            guild.skills_rank = guildRank++

            return guild
          })

        // Sets slayer guild ranks
        guildRank = 1
        guilds
          .sort((v1, v2) => {
            return v2.average_slayer > v1.average_slayer ? 1 : -1
          })
          .map((guild, index) => {
            if (guild.meta.hasOwnProperty('hidden')) {
              return guild
            }

            guild.slayers_rank = guildRank++

            return guild
          })

        // Sets catacombs guild ranks
        guildRank = 1
        guilds
          .sort((v1, v2) => {
            return v2.average_catacomb > v1.average_catacomb ? 1 : -1
          })
          .map((guild, index) => {
            if (guild.meta.hasOwnProperty('hidden')) {
              return guild
            }

            guild.catacombs_rank = guildRank++

            return guild
          })

        Store.put('guilds', guilds)

        this.isLoading = false
      })
  },

  data() {
    return {
      isLoading: true,
      message: 'Loading stats...',
      announcement: window.announcement,
    }
  },
}
</script>
