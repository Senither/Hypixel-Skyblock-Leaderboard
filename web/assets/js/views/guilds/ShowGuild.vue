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
                                    <span class="tag is-dark">Catacomb</span>
                                    <span class="tag is-success">{{ formatNumber(guild.average_catacomb) }}</span>
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

                    <div class="is-centered" style="display: flex">
                        <div class="field is-grouped is-centered is-grouped-multiline" style="margin: auto">
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Total Weight</span>
                                    <span class="tag is-purple">
                                        {{ guild.weight.total }}
                                    </span>
                                </div>
                            </div>
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Skill Weight</span>
                                    <span class="tag is-purple">
                                        {{ guild.weight.skill }}
                                    </span>
                                </div>
                            </div>
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Slayer Weight</span>
                                    <span class="tag is-purple">
                                        {{ guild.weight.slayer }}
                                    </span>
                                </div>
                            </div>
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Catacomb Weight</span>
                                    <span class="tag is-purple">
                                        {{ guild.weight.catacomb }}
                                    </span>
                                </div>
                            </div>
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Weight Multiplier</span>
                                    <span class="tag is-purple">
                                        {{ weightMultiplier }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <div class="columns">
                        <div class="column has-text-right">
                            <h2 class="subtitle">
                                <router-link :to="{ name: 'guilds' }" class="button">
                                    <span class="icon is-small">
                                        <i class="fas fa-arrow-alt-circle-left"></i>
                                    </span>
                                    <span>Return to guild list</span>
                                </router-link>
                            </h2>
                        </div>

                        <div class="column has-text-left">
                            <h2 class="subtitle">
                                <router-link :to="{ name: 'guilds.compare', params: { ids: this.guild.id } }" class="button">
                                    <span>Compare guild metrics</span>
                                    <span class="icon is-small">
                                        <i class="fas fa-chart-pie"></i>
                                    </span>
                                </router-link>
                            </h2>
                        </div>
                    </div>
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
                        v-if="this.sevenDaysSkillsMetrics.length > 0"
                        :name="'Average Skills (Last 7 days)'"
                        :type="'Average Skills'"
                        :keys="this.sevenDaysDates"
                        :values="this.sevenDaysSkillsMetrics"
                    />

                    <line-chart
                        v-if="this.monthSkillsMetrics.length > 7"
                        :name="'Average Skills (Last 30 days)'"
                        :type="'Average Skills'"
                        :keys="this.monthDates"
                        :values="this.monthSkillsMetrics"
                    />

                    <line-chart
                        v-if="this.quarterSkillsMetrics.length > 30"
                        :name="'Average Skills (90 Days)'"
                        :type="'Average Skills'"
                        :keys="this.quarterDates"
                        :values="this.quarterSkillsMetrics"
                    />
                </div>
                <div class="column has-text-centered">
                    <h4 class="subtitle is-4">Slayer Metrics</h4>

                    <line-chart
                        v-if="this.sevenDaysSlayersMetrics.length > 0"
                        :name="'Average Slayers (Last 7 days)'"
                        :type="'Average Slayers'"
                        :keys="this.sevenDaysDates"
                        :values="this.sevenDaysSlayersMetrics"
                    />

                    <line-chart
                        v-if="this.monthSlayersMetrics.length > 7"
                        :name="'Average Slayers (Last 30 days)'"
                        :type="'Average Slayers'"
                        :keys="this.monthDates"
                        :values="this.monthSlayersMetrics"
                    />

                    <line-chart
                        v-if="this.quarterSlayersMetrics.length > 30"
                        :name="'Average Slayers (90 Days)'"
                        :type="'Average Slayers'"
                        :keys="this.quarterDates"
                        :values="this.quarterSlayersMetrics"
                    />
                </div>
            </div>

            <div class="columns" v-if="quarterMembersMetrics.length > 1">
                <div class="column has-text-centered">
                    <h4 class="subtitle is-4">Member Metrics</h4>

                    <line-chart
                        v-if="this.quarterMembersMetrics.length > 1"
                        :name="'Average Members (90 Days)'"
                        :type="'Average Members'"
                        :keys="this.quarterDates"
                        :values="this.quarterMembersMetrics"
                    />
                </div>
            </div>

            <div class="columns" v-if="quarterWeightMetrics.length > 1">
                <div class="column has-text-centered">
                    <h4 class="subtitle is-4">Weight Metrics</h4>

                    <line-chart
                        v-if="this.quarterWeightMetrics.length > 1"
                        :name="'Guild Weight (90 Days)'"
                        :type="'Guild Progress Weight'"
                        :keys="this.quarterDates"
                        :values="this.quarterWeightMetrics"
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
                            <li
                                @click="clickSort('catacomb_xp')"
                                :class="{ 'is-active': this.playerSortMethod == 'catacomb_xp' }"
                            ><a>Sort by Catacombs</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <player
                v-for="(player, rank) of sortedPlayers"
                :player="player"
                :rank="rank + 1"
                :key="player.uuid"
            />
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    import LineChart from '@components/LineChart';
    import Loading from '@components/Loading';
    import Player from '@components/Player';

    import Store from '@/store';

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
                this.metrics = response.data.data;

                this.getItemsFromMetrics(7).forEach(metric => {
                    this.sevenDaysDates.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));

                    this.sevenDaysSkillsMetrics.push(metric.average_skill_progress);
                    this.sevenDaysSlayersMetrics.push(metric.average_slayer);
                });

                this.getItemsFromMetrics(30).forEach(metric => {
                    this.monthDates.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));

                    this.monthSkillsMetrics.push(metric.average_skill_progress);
                    this.monthSlayersMetrics.push(metric.average_slayer);
                });

                this.getItemsFromMetrics(90).forEach(metric => {
                    this.quarterDates.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));

                    this.quarterSkillsMetrics.push(metric.average_skill_progress);
                    this.quarterSlayersMetrics.push(metric.average_slayer);
                    this.quarterMembersMetrics.push(metric.members);
                    this.quarterWeightMetrics.push(metric.weight.total);
                });

                this.sevenDaysDates.reverse();
                this.monthDates.reverse();
                this.quarterDates.reverse();

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
                sevenDaysDates: [],
                monthDates: [],
                quarterDates: [],
                sevenDaysSkillsMetrics: [],
                monthSkillsMetrics: [],
                quarterSkillsMetrics: [],
                sevenDaysSlayersMetrics: [],
                monthSlayersMetrics: [],
                quarterSlayersMetrics: [],
                quarterMembersMetrics: [],
                quarterWeightMetrics: [],
            };
        },
        methods: {
            clickSort(method) {
                this.playerSortMethod = method;
            },
            getItemsFromMetrics(amount = 999999999) {
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
            weightMultiplier() {
                if (this.guild == null) {
                    return '??';
                }

                let multiplier = this.guild.weight.multiplier;
                let parts = this.formatNumber(multiplier * 100, 2)
                    .split(',')[0]
                    .split('\.');

                if (parts[1] == '00') {
                    return parts[0] + '%';
                }

                return parts.join('.') + '%';
            },
            sortedPlayers() {
                return this.players.sort((v1, v2) => {
                    return v2[this.playerSortMethod] > v1[this.playerSortMethod] ? 1 : -1;
                });
            }
        }
    }
</script>
