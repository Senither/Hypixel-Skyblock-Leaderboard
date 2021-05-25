<template>
  <div>
    <section class="hero has-text-centered has-no-background">
      <div class="hero-body">
        <div class="container" v-if="isLoading">
          <loading :message="'Loading player metrics'" />
        </div>
        <div class="container" v-else>
          <h1 class="title is-1">{{ player.username }} Overview</h1>
          <h3 class="subtitle is-3">
            From <a @click="goToGuild">{{ player.guild_name }}</a>
          </h3>

          <p>
            <router-link :to="{ name: 'history.player', params: { uuid: player.uuid } }" class="button is-small">
              <span>View Guild History</span>
            </router-link>
            <a :href="`https://sky.shiiyu.moe/stats/${player.username}`" target="blank" class="button is-small">View on sky.shiiyu.moe</a>
            <a :href="`https://namemc.com/profile/${player.uuid}`" target="blank" class="button is-small">View on NameMC</a>
            <a :href="`https://plancke.io/hypixel/player/stats/${player.uuid}`" target="blank" class="button is-small">View on Plancke</a>
          </p>

          <br />

          <p>
            <router-link :to="{ name: 'players' }" class="button">
              <span class="icon is-small">
                <i class="fas fa-arrow-alt-circle-left"></i>
              </span>
              <span>Return to Players List</span>
            </router-link>
          </p>

          <hr />

          <div class="columns">
            <div class="column has-text-centered">
              <h3 class="subtitle is-3">
                Weight Metrics
                <div class="control" style="display: flex; justify-content: center; margin-top: 8px">
                  <div class="tags has-addons">
                    <span class="tag is-dark">Total Weight</span>
                    <span class="tag is-purple">
                      {{ formatNumber(player.weight.toFixed(2), 2) }}
                    </span>
                  </div>
                </div>
              </h3>
              <p>
                Drops in the weight chart can be caused by changes made to the weight formula, or if the player has toggled their APIs on or off during some
                <br>period, causing the leaderboard to not be able to fetch their accurate information.
              </p>
              <line-chart key="weight" name="" type="Weight Over Time" :keys="dates" :values="metrics.map(metric => metric['weight'])" />
            </div>
          </div>

          <div class="columns">
            <div class="column has-text-centered">
              <h3 class="subtitle is-3">
                Skills & Averages
                <div class="control" style="display: flex; justify-content: center; margin-top: 8px">
                  <div class="tags has-addons">
                    <span class="tag is-dark">Weight</span>
                    <span class="tag is-purple">
                      {{ formatNumber(player.skill_weight.toFixed(2), 2) }}
                    </span>
                  </div>
                </div>
              </h3>
              <p>
                {{ player.username }}'s average skill level is <strong class="tag">{{ player.average_skill_progress }}</strong> or
                <strong class="tag">{{ player.average_skill }}</strong> without skill progress.
              </p>
            </div>
          </div>
          <div class="columns">
            <div class="column" v-for="group of skills">
              <skill-progress
                v-for="skill of Object.keys(group)"
                :key="skill"
                :name="group[skill].name"
                :level="player[skill]"
                :xp="player[skill + '_xp']"
                :max-level="group[skill].maxLevel"
              />
            </div>
          </div>

          <div class="columns" v-if="!showSkills">
            <div class="column has-text-centered">
              <a @click="viewSkills" class="button is-primary" :class="{ 'is-loading': loadingSkills }"> Show Skill Metrics </a>
            </div>
          </div>
          <div v-else>
            <div class="columns">
              <div class="column has-text-centered">
                <h4 class="subtitle is-4">Skill Metrics</h4>
              </div>
            </div>
            <div class="columns">
              <div class="column" v-for="group of skillCharts">
                <line-chart
                  v-for="skill of Object.keys(group)"
                  :key="skill"
                  :name="group[skill]"
                  :type="group[skill]"
                  :keys="dates"
                  :values="metrics.map(metric => metric[skill])"
                />
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column has-text-centered">
              <h3 class="subtitle is-3">
                Slayers
                <div class="control" style="display: flex; justify-content: center; margin-top: 8px">
                  <div class="tags has-addons">
                    <span class="tag is-dark">Weight</span>
                    <span class="tag is-purple">
                      {{ formatNumber(player.slayer_weight.toFixed(2), 2) }}
                    </span>
                  </div>
                </div>
              </h3>
            </div>
          </div>
          <div class="columns">
            <div class="column" v-for="type of Object.keys(slayers)">
              <slayer-progress :name="slayers[type]" :xp="player[type]" />
            </div>
          </div>

          <div class="columns" v-if="!showSlayers">
            <div class="column has-text-centered">
              <a @click="viewSlayers" class="button is-primary" :class="{ 'is-loading': loadingSlayers }"> Show Slayer Metrics </a>
            </div>
          </div>
          <div v-else>
            <div class="columns">
              <div class="column has-text-centered">
                <h4 class="subtitle is-4">Slayer Metrics</h4>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <line-chart
                  v-for="type of Object.keys(slayers)"
                  :key="type"
                  :name="slayers[type] + ' Slayer'"
                  :type="slayers[type] + ' Slayer'"
                  :keys="dates"
                  :values="metrics.map(metric => metric[type])"
                />
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column has-text-centered">
              <h3 class="subtitle is-3">
                Dungeons
                <div class="control" style="display: flex; justify-content: center; margin-top: 8px">
                  <div class="tags has-addons">
                    <span class="tag is-dark">Weight</span>
                    <span class="tag is-purple">
                      {{ formatNumber(player.dungeon_weight.toFixed(2), 2) }}
                    </span>
                  </div>
                </div>
              </h3>
            </div>
          </div>
          <div class="columns">
            <div class="column" v-for="dungeon of dungeons">
              <skill-progress v-for="type of Object.keys(dungeon)" :key="type" :name="dungeon[type]" :level="player[type]" :xp="player[type + '_xp']" />
            </div>
          </div>

          <div class="columns" v-if="!showDungeons">
            <div class="column has-text-centered">
              <a @click="viewDungeons" class="button is-primary" :class="{ 'is-loading': loadingDungeons }"> Show Dungeon Metrics </a>
            </div>
          </div>
          <div v-else>
            <div class="columns">
              <div class="column has-text-centered">
                <h4 class="subtitle is-4">Dungeon Metrics</h4>
              </div>
            </div>
            <div class="columns">
              <div class="column" v-for="group of dungeonCharts">
                <line-chart
                  v-for="type of Object.keys(group)"
                  :key="type"
                  :name="group[type]"
                  :type="group[type]"
                  :keys="dates"
                  :values="metrics.map(metric => metric[type])"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment'

import SlayerProgress from '@components/SlayerProgress'
import SkillProgress from '@components/SkillProgress'
import LineChart from '@components/LineChart'
import Loading from '@components/Loading'

import Store from '@/store'

export default {
  components: {
    SlayerProgress,
    SkillProgress,
    LineChart,
    Loading,
  },

  mounted() {
    let uuid = this.$route.params.uuid ?? null
    if (uuid == null) {
      return this.$router.push({
        name: 'players',
      })
    }

    axios
      .get(`/players?uuid=${uuid}`)
      .then(response => {
        if (response.data.data.length == 0) {
          return this.$router.push({
            name: 'players',
          })
        }

        this.player = response.data.data[0]

        return axios.get(`/player/${uuid}`)
      })
      .then(response => {
        this.metrics = response.data.data
        this.metrics.forEach(metric => {
          this.dates.push(moment(metric.created_at).format('DD MMM YYYY - hh:mm'))
        })
        this.dates.reverse()

        this.isLoading = false
      })
  },

  data() {
    return {
      isLoading: true,
      player: null,
      metrics: null,
      dates: [],
      showSkills: false,
      loadingSkills: false,
      showSlayers: false,
      loadingSlayers: false,
      showDungeons: false,
      loadingDungeons: false,

      skills: [
        {
          taming: {
            name: 'Taming',
            maxLevel: 50,
          },
          mining: {
            name: 'Mining',
            maxLevel: 60,
          },
          foraging: {
            name: 'Foraging',
            maxLevel: 50,
          },
          enchanting: {
            name: 'Enchanting',
            maxLevel: 60,
          },
          carpentry: {
            name: 'Carpentry',
            maxLevel: 50,
          },
        },
        {
          farming: {
            name: 'Farming',
            maxLevel: 60,
          },
          combat: {
            name: 'Combat',
            maxLevel: 50,
          },
          fishing: {
            name: 'Fishing',
            maxLevel: 50,
          },
          alchemy: {
            name: 'Alchemy',
            maxLevel: 50,
          },
          runecrafting: {
            name: 'Runecrafting',
            maxLevel: 25,
          },
        },
      ],
      skillCharts: [
        {
          taming: 'Taming Skills',
          mining: 'Mining Skills',
          foraging: 'Foraging Skills',
          enchanting: 'Enchanting Skills',
          farming: 'Farming Skills',
          combat: 'Combat Skills',
          fishing: 'Fishing Skills',
          alchemy: 'Alchemy Skills',
        },
        {
          taming_xp: 'Taming XP',
          mining_xp: 'Mining XP',
          foraging_xp: 'Foraging XP',
          enchanting_xp: 'Enchanting XP',
          farming_xp: 'Farming XP',
          combat_xp: 'Combat XP',
          fishing_xp: 'Fishing XP',
          alchemy_xp: 'Alchemy XP',
        },
      ],

      slayers: {
        revenant_xp: 'Revenant',
        tarantula_xp: 'Tarantula',
        sven_xp: 'Sven',
      },

      dungeons: [
        {
          catacomb: 'Catacombs',
          berserk: 'Berserker',
          tank: 'Tank',
        },
        {
          mage: 'Mage',
          archer: 'Archer',
          healer: 'Healer',
        },
      ],
      dungeonCharts: [
        {
          catacomb: 'Catacombs Level',
          healer: 'Healer Level',
          mage: 'Mage Level',
          berserk: 'Berserker Level',
          archer: 'Archer Level',
          tank: 'Tank Level',
        },
        {
          catacomb_xp: 'Catacombs XP',
          healer_xp: 'Healer XP',
          mage_xp: 'Mage XP',
          berserk_xp: 'Berserker XP',
          archer_xp: 'Archer XP',
          tank_xp: 'Tank XP',
        },
      ],
    }
  },

  methods: {
    goToGuild() {
      let guild = Store.get('guilds').find(guild => {
        return guild.name == this.player.guild_name
      })

      this.$router.push({
        name: 'guilds.show',
        params: { id: guild.id },
      })
    },

    viewSkills() {
      this.loadingSkills = true
      setTimeout(() => (this.showSkills = true), 200)
    },

    viewSlayers() {
      this.loadingSlayers = true
      setTimeout(() => (this.showSlayers = true), 200)
    },

    viewDungeons() {
      this.loadingDungeons = true
      setTimeout(() => (this.showDungeons = true), 200)
    },
  },
}
</script>
