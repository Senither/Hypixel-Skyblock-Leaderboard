<template>
    <div>
        <section class="hero has-text-centered has-no-background">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title is-1">
                        Guild Metrics Comparison
                    </h1>

                    <router-link :to="{ name: 'guilds' }" class="button">
                        <span class="icon is-small">
                            <i class="fas fa-arrow-alt-circle-left"></i>
                        </span>
                        <span>Return to guild list</span>
                    </router-link>
                </div>
            </div>
        </section>

        <loading
            v-if="isLoading"
            :message="'Loading guild metrics data...'"
        />

        <div class="columns" v-else>
            <div class="column">
                <div class="columns">
                    <div class="column">
                        <b-taginput
                            v-model="selectedGuilds"
                            :data="filteredGuilds"
                            autocomplete
                            field="name"
                            placeholder="Enter a guild name here..."
                            @typing="getFilteredGuilds">
                        </b-taginput>
                    </div>
                </div>
                <div class="columns" v-if="selectedGuilds.length > 0">
                    <div class="column">
                        <h4 class="subtitle has-text-centered is-4">Skill Metrics</h4>
                        <line-chart
                            :name="'Average Skills (Last 90 days)'"
                            :type="'Average Skills'"
                            :keys="this.metricDates"
                            :values="this.skillsMetrics"
                        />

                        <h4 class="subtitle has-text-centered is-4">Slayer Metrics</h4>
                        <line-chart
                            :name="'Average Slayers (Last 90 days)'"
                            :type="'Average Slayers'"
                            :keys="this.metricDates"
                            :values="this.slayersMetrics"
                        />

                        <h4 class="subtitle has-text-centered is-4">Member Metrics</h4>
                        <line-chart
                            :name="'Members (Last 90 days)'"
                            :type="'Members'"
                            :keys="this.metricDates"
                            :values="this.membersMetrics"
                        />
                    </div>
                </div>
                <div class="columns" v-else>
                    <div class="column has-text-centered">
                        <p>Enter the name of a one or more guilds in the input box above to to view and compare the metrics!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    a.dropdown-item:hover,
    .autocomplete .dropdown-item.is-hovered,
    .autocomplete .dropdown .dropdown-menu .has-link a.is-hovered,
    .dropdown .dropdown-menu .has-link .autocomplete a.is-hovered {
        color: #1abc9c !important;
    }
    .input, .select select, .taginput .taginput-container.is-focusable, .textarea {
        background-color: #1f2424;
        border-color: #4a4e4e;
        color: #8c9b9d;
    }
    .input, .select select, .taginput .taginput-container.is-focusable, .textarea {
        &::placeholder {
            color: #373D3F;
        }
    }
</style>

<script>
    import moment from 'moment';

    import LineChart from '../../components/LineChart';
    import Loading from '../../components/Loading';

    import Store from '../../store';

    export default {
        components: {
            LineChart,
            Loading,
            },
        mounted() {
            let ids = this.$route.params.ids ?? null;
            if (ids != null) {
                ids.split('.').forEach(id => {
                    let guild = this.filteredGuilds.find(guild => guild.id == id) ?? null;
                    if (guild != null) {
                        this.selectedGuilds.push(guild);
                    }
                })
            }

            this.loadMetrics().then(() => this.isLoading = false);
        },
        data() {
            return {
                isLoading: true,
                filteredGuilds: Store.get('guilds'),
                selectedGuilds: [],
                metrics: {},
                metricDates: [],
            };
        },
        methods: {
            getFilteredGuilds(text) {
                this.filteredGuilds = Store.get('guilds').filter(guild => {
                    if (this.selectedGuilds.find(selectedGuild => selectedGuild.id == guild.id) != undefined) {
                        return false;
                    }
                    return guild.name.toLowerCase().includes(text.toLowerCase());
                });
            },
            generateMetricsFromType(type) {
                let guilds = {};
                for (let guild of this.selectedGuilds) {
                    guilds[guild.name] = this.metrics[guild.id].map(metric => {
                        return metric == null ? null : metric[type];
                    });
                }
                return guilds;
            },
            async loadMetrics() {
                this.metrics = Object.keys(this.metrics)
                    .filter(guildId => this.selectedGuilds.find(guild => guild.id == guildId) != undefined)
                    .reduce((metrics, guildId) => {
                        metrics[guildId] = this.metrics[guildId];
                        return metrics;
                    }, {});

                for (let guild of this.selectedGuilds) {
                    if (this.metrics.hasOwnProperty(guild.id)) {
                        continue;
                    }

                    let response = await axios.get('/metrics/' + guild.id);

                    this.metrics[guild.id] = response.data.data.splice(0, 90).map(metric => {
                        return {
                            average_skill_progress: metric.average_skill_progress,
                            average_slayer: metric.average_slayer,
                            members: metric.members,
                            created_at: metric.created_at,
                        };
                    });
                }

                this.metricDates = [];
                if (this.selectedGuilds.length <= 0) {
                    return Promise.resolve();
                }

                let largetMetricDataPoint = Object.values(this.metrics)
                    .map(metrics => {
                        return metrics.filter(v => v != null);
                    }).sort((v1, v2) => v2 < v1 ? -1 : 1)[0];

                this.metricDates = largetMetricDataPoint.map(metric => {
                    return moment(metric.created_at).format("DD MMM YYYY - hh:mm")
                });

                let totalItems = this.metricDates.length;

                for (let guildId of Object.keys(this.metrics)) {
                    if (this.metrics[guildId].length < totalItems) {
                        for (let i = this.metrics[guildId].length; i < totalItems; i++) {
                            this.metrics[guildId].push(null)
                        }
                    }
                }

                return Promise.resolve();
            }
        },
        computed: {
            skillsMetrics() {
                return this.generateMetricsFromType('average_skill_progress');
            },
            slayersMetrics() {
                return this.generateMetricsFromType('average_slayer');
            },
            membersMetrics() {
                return this.generateMetricsFromType('members');
            },
        },
        watch: {
            selectedGuilds(state, before) {
                let queryParam = state.map(guild => guild.id).join('.');
                let paths = this.$route.path.split('/');
                let uri = paths.length > 2 ? paths.splice(0, paths.length - 1).join('/') : paths.join('/');

                history.pushState({}, null, `${uri}/${queryParam}`);

                this.isLoading = true;
                this.loadMetrics().then(() => {
                    this.isLoading = false;
                });
            }
        }
    };
</script>
