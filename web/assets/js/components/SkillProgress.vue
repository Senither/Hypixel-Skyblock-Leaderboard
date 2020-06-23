<template>
    <div class="skill">
        <div class="name">{{ name }} {{ Math.floor(this.level) }}</div>
        <div class="xp" v-if="this.xp > 0">{{ formatNumber(this.xp) }} XP</div>
        <progress
            v-if="Math.floor(this.level) < 50"
            class="progress is-primary"
            :value="this.percentage"
            max="100"
        ></progress>

        <progress
            v-else
            class="progress is-info"
            value="100"
            max="100"
        ></progress>
    </div>
</template>

<style lang="scss" scoped>
    .skill {
        & .name {
            font-weight: bolder;
            float: left;
        }
        & .xp {
            float: right;
        }
        & .progress {
            margin-bottom: 6px;
        }
    }
</style>

<script>
    export default {
        props: {
            name: String,
            level: Number,
            xp: Number,
        },
        computed: {
            percentage() {
                return (this.level - Math.floor(this.level)) * 100;
            }
        }
    }
</script>
