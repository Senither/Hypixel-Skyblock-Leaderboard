<template>
  <div class="slayer">
    <div class="name">{{ name }} {{ Math.floor(this.level) }}</div>
    <div class="xp" v-if="this.xp > 0">{{ formatNumber(this.xp) }} XP</div>
    <progress v-if="Math.floor(this.level) < 9" class="progress is-primary" :value="this.percentage" max="100"></progress>

    <progress v-else class="progress is-info" value="100" max="100"></progress>
  </div>
</template>

<script>
const slayerExperience = [5, 15, 200, 1000, 5000, 20000, 100000, 400000, 1000000]

export default {
  props: {
    name: String,
    xp: Number,
  },

  computed: {
    percentage() {
      return (this.level - Math.floor(this.level)) * 100
    },

    level() {
      for (let level = 0; level < slayerExperience.length; level++) {
        let requirement = slayerExperience[level]
        if (this.xp < requirement) {
          let lastRequirement = level == 0 ? 0 : slayerExperience[level - 1]

          return level + (this.xp - lastRequirement) / (requirement - lastRequirement)
        }
      }
      return 9
    },
  },
}
</script>

<style lang="scss" scoped>
.slayer {
  & .name {
    font-weight: bolder;
    float: left;
  }
  & .xp {
    float: right;
  }
}
</style>
