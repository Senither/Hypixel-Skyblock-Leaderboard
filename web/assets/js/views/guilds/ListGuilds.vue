<template>
  <div>
    <section class="hero has-text-centered has-no-background">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Hypixel SkyBlock Guild Leaderboard</h1>
          <h2 class="subtitle">Currently tracking {{ formatNumber(stats.guilds) }} guilds with {{ formatNumber(stats.players) }} members!</h2>

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
        <div class="box">
          <table class="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <th class="is-clickable" @click="clickSort('name')">
                  Name
                  <sort-button v-show="sorter == 'name'" :sort="this.reverseSort" />
                </th>
                <th class="is-clickable" @click="clickSort('weight')">
                  Weight
                  <sort-button v-show="sorter == 'weight'" :sort="this.reverseSort" />
                </th>
                <th class="is-clickable" @click="clickSort('members')">
                  Members
                  <sort-button v-show="sorter == 'members'" :sort="this.reverseSort" />
                </th>
                <th class="is-clickable" @click="clickSort('average_skill_progress')">
                  Average Skills
                  <sort-button v-show="sorter == 'average_skill_progress'" :sort="this.reverseSort" />
                </th>
                <th class="is-clickable" @click="clickSort('average_slayer')">
                  Average Slayer
                  <sort-button v-show="sorter == 'average_slayer'" :sort="this.reverseSort" />
                </th>
                <th class="is-clickable" @click="clickSort('average_catacomb')">
                  Average Catacombs
                  <sort-button v-show="sorter == 'average_catacomb'" :sort="this.reverseSort" />
                </th>
                <th>Last updated</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(guild, index) of guilds" @click="clickGuild(guild)" :class="{ 'was-skipped': guild.last_skipped_at !== null }">
                <th>{{ index + 1 }}</th>
                <td>{{ guild.name }}</td>
                <td
                  :data-tooltip="`${guild.name} has a ${guild.weight.skill} skill weight, ${guild.weight.catacomb} catacomb weight, and ${guild.weight.slayer} slayer weight, with a ${guild.weight.multiplier} multiplier`"
                >
                  <span class="tag is-purple">{{ formatNumber(parseFloat(guild.weight.total), 2) }}</span>
                </td>
                <td>
                  <span class="tag is-warning">{{ guild.members }}</span>
                </td>
                <td :data-tooltip="`${guild.name} is rank #${guild.skills_rank} for average skills`">
                  <div class="tags has-addons">
                    <span class="tag is-info">{{ formatNumber(guild.average_skill_progress, 2) }}</span>
                    <span class="tag is-primary">{{ formatNumber(guild.average_skill, 2) }}</span>
                  </div>
                </td>
                <td :data-tooltip="`${guild.name} is rank #${guild.slayers_rank} for average slayers`">
                  <span class="tag is-danger">{{ formatNumber(guild.average_slayer) }}</span>
                </td>
                <td :data-tooltip="`${guild.name} is rank #${guild.catacombs_rank} for average catacombs level`">
                  <span class="tag is-success">{{ formatNumber(guild.average_catacomb) }}</span>
                </td>
                <td>{{ guild.last_updated_at_humanized }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SortButton from '@components/SortButton'
import Store from '@/store'
import moment from 'moment'

export default {
  components: {
    SortButton,
  },

  data() {
    return {
      sorter: 'weight',
      reverseSort: false,
    }
  },

  methods: {
    clickSort(method, reverse = null) {
      if (reverse == null) {
        reverse = this.reverseSort
      }

      if (this.sorter == method) {
        reverse = !reverse
      }

      this.sorter = method
      this.reverseSort = reverse
    },

    clickGuild(guild) {
      this.$router.push({
        name: 'guilds.show',
        params: { id: guild.id },
      })
    },
  },

  computed: {
    stats() {
      return Store.get('stats')
    },

    guilds() {
      return Store.get('guilds')
        .filter(guild => {
          return !guild.meta.hasOwnProperty('hidden')
        })
        .sort((v1, v2) => {
          let getProperty = this.sorter == 'weight' ? type => type.weight.total : type => type[this.sorter]

          return this.reverseSort ? (getProperty(v1) > getProperty(v2) ? 1 : -1) : getProperty(v2) > getProperty(v1) ? 1 : -1
        })
        .map(guild => {
          guild.last_updated_at_humanized = moment(guild.last_updated_at).toNow().split(' ').splice(1).join(' ') + ' ago'

          return guild
        })
    },
  },
}
</script>

<style lang="scss" scoped>
tbody > tr {
  cursor: pointer;

  &.was-skipped {
    background-color: rgba(#ff3860, 0.3) !important;

    &:hover {
      background-color: rgba(#ff3860, 0.15) !important;
    }
  }
}
</style>
