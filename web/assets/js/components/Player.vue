<template>
  <article class="card">
    <header class="card-header">
      <div v-on:click="toggleCollaps(player)" class="columns is-clickable is-gapless" style="width: 100%">
        <p class="card-header-title">
          <span class="tag is-primary player-rank" :class="{ 'is-active': !player.collaps }"> #{{ rank }} </span>
          {{ player.username }}
        </p>
        <div class="is-centered player-tags">
          <div class="field is-grouped is-centered is-grouped-multiline" style="margin: auto">
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">Average Skill Progress</span>
                <span class="tag is-info">
                  {{ formatNumber(player.average_skill_progress, 2) }}
                </span>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">Average Skill</span>
                <span class="tag is-primary">
                  {{ formatNumber(player.average_skill, 2) }}
                </span>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">Slayer</span>
                <span class="tag is-danger">
                  {{ formatNumber(player.total_slayer) }}
                </span>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">Catacomb</span>
                <span class="tag is-success">
                  {{ formatNumber(player.catacomb) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <a class="card-header-icon" aria-label="more options">
          <span class="icon">
            <i
              class="fas"
              aria-hidden="true"
              :class="{
                'fa-angle-down': !player.collaps,
                'fa-angle-left': player.collaps,
              }"
            ></i>
          </span>
        </a>
      </div>
    </header>
    <div class="card-content" v-if="!player.collaps">
      <div class="content">
        <div class="columns">
          <div class="column has-text-centered">
            <h4>Skills</h4>
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
        <div class="columns">
          <div class="column has-text-centered">
            <h4>Slayers</h4>
          </div>
        </div>
        <div class="columns">
          <div class="column" v-for="type of Object.keys(slayers)">
            <slayer-progress :name="slayers[type]" :xp="player[type]" />
          </div>
        </div>
        <div class="columns">
          <div class="column has-text-centered">
            <h4>Dungeons</h4>
          </div>
        </div>
        <div class="columns">
          <div class="column" v-for="dungeon of dungeons">
            <skill-progress v-for="type of Object.keys(dungeon)" :key="type" :name="dungeon[type]" :level="player[type]" :xp="player[type + '_xp']" />
          </div>
        </div>
      </div>
    </div>
    <footer class="card-footer" v-if="!player.collaps">
      <router-link
        class="card-footer-item"
        tag="a"
        :to="{
          name: 'players.show',
          params: { uuid: player.uuid },
        }"
      >
        View Metrics
      </router-link>
      <a :href="`https://sky.shiiyu.moe/stats/${player.username}`" target="blank" class="card-footer-item"> View on sky.shiiyu.moe </a>
      <a :href="`https://namemc.com/profile/${player.uuid}`" target="blank" class="card-footer-item"> View on NameMC </a>
      <a :href="`https://plancke.io/hypixel/player/stats/${player.uuid}`" target="blank" class="card-footer-item"> View on Plancke </a>
    </footer>
  </article>
</template>

<script>
import SlayerProgress from './SlayerProgress'
import SkillProgress from './SkillProgress'

export default {
  props: {
    player: Object,
    rank: Number,
  },

  data() {
    return {
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
    }
  },

  components: {
    SlayerProgress,
    SkillProgress,
  },

  methods: {
    toggleCollaps(item) {
      item.collaps = !item.collaps
      this.$forceUpdate()
    },
  },
}
</script>

<style lang="scss" scoped>
.card-header {
  & .player-rank {
    border-radius: 10em;
    margin-right: 8px;
    transition: background 0.25s ease;
    background: rgba(55, 90, 127, 0.35);
  }

  &:hover .player-rank,
  & .player-rank.is-active {
    background: rgba(55, 90, 127, 1);
  }
}

.card {
  margin-bottom: 3px;

  & .card-header-title {
    flex-grow: 0;
    width: 0vw;
  }

  & .player-tags {
    display: flex;
    flex-grow: 1;
  }

  & .field .control {
    margin-bottom: 0 !important;
  }
}
</style>
