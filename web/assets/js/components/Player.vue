<template>
  <article class="card">
    <header class="card-header">
      <div v-on:click="toggleCollaps(player)" class="columns is-clickable is-gapless" style="width: 100%">
        <p class="card-header-title">
          <span class="tag is-primary player-rank" :class="{ 'is-active': !player.collaps }">#{{ rank }}</span>
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
                <span class="tag is-primary">{{ formatNumber(player.average_skill, 2) }}</span>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">Slayer</span>
                <span class="tag is-danger">{{ formatNumber(player.total_slayer) }}</span>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">Catacomb</span>
                <span class="tag is-success">{{ formatNumber(player.catacomb) }}</span>
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
          <div class="column">
            <skill-progress :name="'Taming'" :level="player.taming" :xp="player.taming_xp" />

            <skill-progress :name="'Mining'" :level="player.mining" :xp="player.mining_xp" />

            <skill-progress :name="'Foraging'" :level="player.foraging" :xp="player.foraging_xp" />

            <skill-progress :name="'Enchanting'" :level="player.enchanting" :xp="player.enchanting_xp" />

            <skill-progress :name="'Carpentry'" :level="player.carpentry" :xp="player.carpentry_xp" />
          </div>
          <div class="column">
            <skill-progress :name="'Farming'" :level="player.farming" :xp="player.farming_xp" />

            <skill-progress :name="'Combat'" :level="player.combat" :xp="player.combat_xp" />

            <skill-progress :name="'Fishing'" :level="player.fishing" :xp="player.fishing_xp" />

            <skill-progress :name="'Alchemy'" :level="player.alchemy" :xp="player.alchemy_xp" />

            <skill-progress
              :name="'Runecrafting'"
              :level="player.runecrafting"
              :xp="player.runecrafting_xp"
              :max-level="25"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column has-text-centered">
            <h4>Slayers</h4>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <slayer-progress :name="'Revenant'" :xp="player.revenant_xp" />
          </div>
          <div class="column">
            <slayer-progress :name="'Tarantula'" :xp="player.tarantula_xp" />
          </div>
          <div class="column">
            <slayer-progress :name="'Sven'" :xp="player.sven_xp" />
          </div>
        </div>
        <div class="columns">
          <div class="column has-text-centered">
            <h4>Dungeons</h4>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <skill-progress :name="'Catacombs'" :level="player.catacomb" :xp="player.catacomb_xp" />

            <skill-progress :name="'Berserker'" :level="player.berserk" :xp="player.berserk_xp" />

            <skill-progress :name="'Tank'" :level="player.tank" :xp="player.tank_xp" />
          </div>

          <div class="column">
            <skill-progress :name="'Mage'" :level="player.mage" :xp="player.mage_xp" />

            <skill-progress :name="'Archer'" :level="player.archer" :xp="player.archer_xp" />

            <skill-progress :name="'Healer'" :level="player.healer" :xp="player.healer_xp" />
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
      <a :href="`https://sky.shiiyu.moe/stats/${player.username}`" target="blank" class="card-footer-item"
        >View on sky.shiiyu.moe</a
      >
      <a :href="`https://namemc.com/profile/${player.uuid}`" target="blank" class="card-footer-item">View on NameMC</a>
      <a :href="`https://plancke.io/hypixel/player/stats/${player.uuid}`" target="blank" class="card-footer-item"
        >View on Plancke</a
      >
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
