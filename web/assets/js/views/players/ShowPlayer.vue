<template>
    <div>
        <section class="hero has-text-centered has-no-background">
            <div class="hero-body">
                <div class="container" v-if="isLoading">
                    <loading :message="'Loading player metrics'" />
                </div>
                <div class="container" v-else>
                    <h1 class="title is-1">
                        {{ player.username }} Overview
                    </h1>
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

                    <br>

                    <p>
                        <router-link :to="{ name: 'players' }" class="button">
                            <span class="icon is-small">
                                <i class="fas fa-arrow-alt-circle-left"></i>
                            </span>
                            <span>Return to Players List</span>
                        </router-link>
                    </p>

                    <hr>

                    <div class="columns">
                        <div class="column has-text-centered">
                            <h3 class="subtitle is-3">Skills & Averages</h3>
                            <p>
                                {{ player.username }}'s average skill level is <strong class="tag">{{ player.average_skill_progress }}</strong>
                                or <strong class="tag">{{ player.average_skill }}</strong> without skill progress.
                            </p>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <skill-progress
                                :name="'Taming'"
                                :level="player.taming"
                                :xp="player.taming_xp"
                            />

                            <skill-progress
                                :name="'Mining'"
                                :level="player.mining"
                                :xp="player.mining_xp"
                            />

                            <skill-progress
                                :name="'Foraging'"
                                :level="player.foraging"
                                :xp="player.foraging_xp"
                            />

                            <skill-progress
                                :name="'Enchanting'"
                                :level="player.enchanting"
                                :xp="player.enchanting_xp"
                            />

                            <skill-progress
                                :name="'Carpentry'"
                                :level="player.carpentry"
                                :xp="player.carpentry_xp"
                            />
                        </div>
                        <div class="column">
                            <skill-progress
                                :name="'Farming'"
                                :level="player.farming"
                                :xp="player.farming_xp"
                            />

                            <skill-progress
                                :name="'Combat'"
                                :level="player.combat"
                                :xp="player.combat_xp"
                            />

                            <skill-progress
                                :name="'Fishing'"
                                :level="player.fishing"
                                :xp="player.fishing_xp"
                            />

                            <skill-progress
                                :name="'Alchemy'"
                                :level="player.alchemy"
                                :xp="player.alchemy_xp"
                            />

                            <skill-progress
                                :name="'Runecrafting'"
                                :level="player.runecrafting"
                                :xp="player.runecrafting_xp"
                                :max-level="25"
                            />
                        </div>
                    </div>

                    <div class="columns" v-if="! showSkills">
                        <div class="column has-text-centered">
                            <a @click="viewSkills" class="button is-primary" :class="{ 'is-loading': this.loadingSkills }">
                                Show Skill Metrics
                            </a>
                        </div>
                    </div>
                    <div v-else>
                        <div class="columns">
                            <div class="column has-text-centered">
                                <h4 class="subtitle is-4">Skill Metrics</h4>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <line-chart
                                    :name="'Taming Skills'"
                                    :type="'Taming Skills'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.taming)"
                                />

                                <line-chart
                                    :name="'Mining Skills'"
                                    :type="'Mining Skills'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.mining)"
                                />

                                <line-chart
                                    :name="'Foraging Skills'"
                                    :type="'Foraging Skills'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.foraging)"
                                />

                                <line-chart
                                    :name="'Enchanting Skills'"
                                    :type="'Enchanting Skills'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.enchanting)"
                                />

                                <line-chart
                                    :name="'Farming Skills'"
                                    :type="'Farming Skills'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.farming)"
                                />

                                <line-chart
                                    :name="'Combat Skills'"
                                    :type="'Combat Skills'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.combat)"
                                />

                                <line-chart
                                    :name="'Fishing Skills'"
                                    :type="'Fishing Skills'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.fishing)"
                                />

                                <line-chart
                                    :name="'Alchemy Skills'"
                                    :type="'Alchemy Skills'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.alchemy)"
                                />
                            </div>
                            <div class="column">
                                <line-chart
                                    :name="'Taming Experience'"
                                    :type="'Taming Experience'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.taming_xp)"
                                />

                                <line-chart
                                    :name="'Mining Experience'"
                                    :type="'Mining Experience'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.mining_xp)"
                                />

                                <line-chart
                                    :name="'Foraging Experience'"
                                    :type="'Foraging Experience'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.foraging_xp)"
                                />

                                <line-chart
                                    :name="'Enchanting Experience'"
                                    :type="'Enchanting Experience'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.enchanting_xp)"
                                />

                                <line-chart
                                    :name="'Farming Experience'"
                                    :type="'Farming Experience'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.farming_xp)"
                                />

                                <line-chart
                                    :name="'Combat Experience'"
                                    :type="'Combat Experience'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.combat_xp)"
                                />

                                <line-chart
                                    :name="'Fishing Experience'"
                                    :type="'Fishing Experience'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.fishing_xp)"
                                />

                                <line-chart
                                    :name="'Alchemy Experience'"
                                    :type="'Alchemy Experience'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.alchemy_xp)"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column has-text-centered">
                            <h3 class="subtitle is-3">Slayers</h3>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <slayer-progress
                                :name="'Revenant'"
                                :xp="player.revenant_xp"
                            />
                        </div>
                        <div class="column">
                            <slayer-progress
                                :name="'Tarantula'"
                                :xp="player.tarantula_xp"
                            />
                        </div>
                        <div class="column">
                            <slayer-progress
                                :name="'Sven'"
                                :xp="player.sven_xp"
                            />
                        </div>
                    </div>

                    <div class="columns" v-if="! showSlayers">
                        <div class="column has-text-centered">
                            <a @click="viewSlayers" class="button is-primary" :class="{ 'is-loading': this.loadingSlayers }">
                                Show Slayer Metrics
                            </a>
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
                                    :name="'Revenant Slayer'"
                                    :type="'Revenant Slayer'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.revenant_xp)"
                                />

                                <line-chart
                                    :name="'Tarantula Slayer'"
                                    :type="'Tarantula Slayer'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.tarantula_xp)"
                                />

                                <line-chart
                                    :name="'Sven Slayer'"
                                    :type="'Sven Slayer'"
                                    :keys="this.dates"
                                    :values="this.metrics.map(metric => metric.sven_xp)"
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
    import moment from 'moment';

    import SlayerProgress from '@components/SlayerProgress';
    import SkillProgress from '@components/SkillProgress';
    import LineChart from '@components/LineChart';
    import Loading from '@components/Loading';

    import Store from '@/store';

    export default {
        components: {
            SlayerProgress,
            SkillProgress,
            LineChart,
            Loading,
        },
        mounted() {
            let uuid = this.$route.params.uuid ?? null;
            if (uuid == null) {
                return this.$router.push({
                    name: 'players'
                });
            }

            axios.get(`/players?uuid=${uuid}`).then(response => {
                if (response.data.data.length == 0) {
                    return this.$router.push({
                        name: 'players'
                    });
                }

                this.player = response.data.data[0];

                return axios.get(`/player/${uuid}`);
            }).then(response => {
                this.metrics = response.data.data;
                this.metrics.forEach(metric => {
                    this.dates.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));
                });
                this.dates.reverse();

                this.isLoading = false;
            });
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
            };
        },
        methods: {
            goToGuild() {
                let guild = Store.get('guilds').find(guild => {
                    return guild.name == this.player.guild_name;
                });

                this.$router.push({
                    name: 'guilds.show',
                    params: { id: guild.id }
                });
            },
            viewSkills() {
                this.loadingSkills = true;
                setTimeout(() => this.showSkills = true, 200);
            },
            viewSlayers() {
                this.loadingSlayers = true;
                setTimeout(() => this.showSlayers = true, 200);
            }
        }
    }
</script>
