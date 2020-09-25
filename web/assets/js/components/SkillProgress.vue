<template>
    <div class="skill">
        <div class="name">{{ name }} {{ this.formattedLevel }}</div>
        <div class="xp" v-if="this.xp > 0">{{ formatNumber(this.xp) }} XP</div>
        <div class="xp" v-else>API DISABLED</div>
        <progress
            v-if="this.formattedLevel < this.maxLevel"
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
            maxLevel: {
                type: Number,
                default: 50,
            },
        },
        computed: {
            percentage() {
                return (this.level - Math.floor(this.level)) * 100;
            },
            formattedLevel() {
                let level = Math.floor(this.level);
                if (level > 0) {
                    return level;
                }
                return 0;
            }
        }
    }
</script>
