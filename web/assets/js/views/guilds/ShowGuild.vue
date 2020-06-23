<template>
    <div>
        <section class="hero has-text-centered has-no-background" v-if="guild != null">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title is-1">
                        {{ guild.name }} Overview
                    </h1>

                    <div class="is-centered" style="display: flex">
                        <div class="field is-grouped is-centered is-grouped-multiline" style="margin: auto">
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Average Skill Progress</span>
                                    <span class="tag is-info">
                                        {{ guild.average_skill_progress }}
                                    </span>
                                </div>
                            </div>
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Average Skill</span>
                                    <span class="tag is-primary">{{ guild.average_skill }}</span>
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
                                    <span class="tag is-dark">Members</span>
                                    <span class="tag is-warning">{{ formatNumber(guild.members) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 class="subtitle">
                        <router-link :to="{ name: 'guilds' }">
                            <i class="fas fa-arrow-alt-circle-left"></i> Return to guild list
                        </router-link>
                    </h2>
                </div>
            </div>
        </section>

        <loading
            v-if="isLoading"
            :message="'Loading metrics & players data...'"
        />

        <div v-else>
            <h3 class="subtitle is-3 has-text-centered">Metrics</h3>
            <div class="columns">
                <div class="column has-text-centered">
                    <h4 class="subtitle is-4">Skill Metrics</h4>

                    <line-chart
                        v-if="this.sevenDaysSkillsMetrics.keys.length > 0 && this.sevenDaysSkillsMetrics.values.length > 0"
                        :name="'Average Skills (Last 7 days)'"
                        :type="'Average Skills'"
                        :keys="this.sevenDaysSkillsMetrics.keys"
                        :values="this.sevenDaysSkillsMetrics.values"
                    />

                    <line-chart
                        v-if="this.monthSkillsMetrics.keys.length > 7 && this.monthSkillsMetrics.values.length > 7"
                        :name="'Average Skills (Last 30 days)'"
                        :type="'Average Skills'"
                        :keys="this.monthSkillsMetrics.keys"
                        :values="this.monthSkillsMetrics.values"
                    />

                    <line-chart
                        v-if="this.quarterSkillsMetrics.keys.length > 30 && this.quarterSkillsMetrics.values.length > 30"
                        :name="'Average Skills (90 Days)'"
                        :type="'Average Skills'"
                        :keys="this.quarterSkillsMetrics.keys"
                        :values="this.quarterSkillsMetrics.values"
                    />
                </div>
                <div class="column has-text-centered">
                    <h4 class="subtitle is-4">Slayer Metrics</h4>

                    <line-chart
                        v-if="this.sevenDaysSlayersMetrics.keys.length > 0 && this.sevenDaysSlayersMetrics.values.length > 0"
                        :name="'Average Slayers (Last 7 days)'"
                        :type="'Average Slayers'"
                        :keys="this.sevenDaysSlayersMetrics.keys"
                        :values="this.sevenDaysSlayersMetrics.values"
                    />

                    <line-chart
                        v-if="this.monthSlayersMetrics.keys.length > 7 && this.monthSlayersMetrics.values.length > 7"
                        :name="'Average Slayers (Last 30 days)'"
                        :type="'Average Slayers'"
                        :keys="this.monthSlayersMetrics.keys"
                        :values="this.monthSlayersMetrics.values"
                    />

                    <line-chart
                        v-if="this.quarterSlayersMetrics.keys.length > 30 && this.quarterSlayersMetrics.values.length > 30"
                        :name="'Average Slayers (90 Days)'"
                        :type="'Average Slayers'"
                        :keys="this.quarterSlayersMetrics.keys"
                        :values="this.quarterSlayersMetrics.values"
                    />
                </div>
            </div>

            <h3 class="subtitle is-3 has-text-centered">Players</h3>
            <div class="columns">
                <div class="column">
                    <div class="tabs is-toggle is-fullwidth">
                        <ul>
                            <li
                                @click="clickSort('average_skill_progress')"
                                :class="{ 'is-active': this.playerSortMethod == 'average_skill_progress' }"
                            ><a>Sort by Skills</a></li>
                            <li
                                @click="clickSort('total_slayer')"
                                :class="{ 'is-active': this.playerSortMethod == 'total_slayer' }"
                            ><a>Sort by Slayers</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <player
                v-for="player of sortedPlayers"
                :player="player"
                :key="player.uuid"
            />
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    import LineChart from '../../components/LineChart';
    import Loading from '../../components/Loading';
    import Player from '../../components/Player';

    import Store from '../../store';

    export default {
        components: {
            LineChart,
            Loading,
            Player,
        },
        mounted() {
            if (this.guild == null) {
                return this.$router.push({
                    name: 'guilds'
                });
            }

            axios.get(`/metrics/${this.guild.id}`).then(response => {
                console.log(response.data.data.length);
                this.metrics = response.data.data;

                this.getItemsFromMetrics(7).forEach(metric => {
                    this.sevenDaysSkillsMetrics.values.push(metric.average_skill_progress);
                    this.sevenDaysSkillsMetrics.keys.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));
                    this.sevenDaysSlayersMetrics.values.push(metric.average_slayer);
                    this.sevenDaysSlayersMetrics.keys.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));
                });

                this.getItemsFromMetrics(30).forEach(metric => {
                    this.monthSkillsMetrics.values.push(metric.average_skill_progress);
                    this.monthSkillsMetrics.keys.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));
                    this.monthSlayersMetrics.values.push(metric.average_slayer);
                    this.monthSlayersMetrics.keys.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));
                });

                this.getItemsFromMetrics(90).forEach(metric => {
                    this.quarterSkillsMetrics.values.push(metric.average_skill_progress);
                    this.quarterSkillsMetrics.keys.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));
                    this.quarterSlayersMetrics.values.push(metric.average_slayer);
                    this.quarterSlayersMetrics.keys.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));
                });


                return axios.get(`/players/${this.guild.id}`);
            }).then(response => {
                this.players = response.data.data.map(player => {
                    player.collaps = true;

                    return player;
                });

                this.isLoading = false;
            });
        },
        data() {
            return {
                isLoading: true,
                metrics: null,
                players: null,
                playerSortMethod: 'average_skill_progress',
                sevenDaysSkillsMetrics: {
                    keys: [],
                    values: [],
                },
                monthSkillsMetrics: {
                    keys: [],
                    values: [],
                },
                quarterSkillsMetrics: {
                    keys: [],
                    values: [],
                },
                sevenDaysSlayersMetrics: {
                    keys: [],
                    values: [],
                },
                monthSlayersMetrics: {
                    keys: [],
                    values: [],
                },
                quarterSlayersMetrics: {
                    keys: [],
                    values: [],
                },
            };
        },
        methods: {
            clickSort(method) {
                this.playerSortMethod = method;
            },
            getItemsFromMetrics(amount = 999999999) {
                console.log(this.metrics[0].created_at, this.metrics[this.metrics.length - 1].created_at);
                let items = [];
                for (let i = 0; i < Math.min(amount, this.metrics.length); i++) {
                    items.push(this.metrics[i]);
                }
                return items;
            }
        },
        computed: {
            guild() {
                const id = this.$route.params.id;

                let guild = Store.get('guilds').filter(guild => {
                    return guild.id == id;
                });
                return guild.length == 0 ? null : guild[0];
            },
            sortedPlayers() {
                return this.players.sort((v1, v2) => {
                    return v2[this.playerSortMethod] > v1[this.playerSortMethod] ? 1 : -1;
                });
            }
        }
    }
</script>
