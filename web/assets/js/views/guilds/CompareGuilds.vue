<template>
    <div>
        <section class="hero has-text-centered has-no-background">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title is-1">
                        Guild Metrics Comparison
                    </h1>
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
                        <h4 class="subtitle is-4">Skill Metrics</h4>
                        <line-chart
                            :name="'Average Skills (Last 90 days)'"
                            :type="'Average Skills'"
                            :keys="this.metricDates"
                            :values="this.skillsMetrics"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .autocomplete .dropdown-item.is-hovered,
    .autocomplete .dropdown .dropdown-menu .has-link a.is-hovered,
    .dropdown .dropdown-menu .has-link .autocomplete a.is-hovered {
        color: #1abc9c !important;
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
                let guilds = Store.get('guilds');

                ids.split('.').forEach(id => {
                    let guild = guilds.find(guild => guild.id == id) ?? null;
                    if (guild != null) {
                        this.selectedGuilds.push(guild);
                    }
                })
            }

            this.loadMetrics();
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
            async loadMetrics() {
                this.isLoading = true;

                for (let guild of this.selectedGuilds) {
                    if (this.metrics.hasOwnProperty(guild.id)) {
                        continue;
                    }

                    let response = await axios.get('/metrics/' + guild.id);

                    this.metrics[guild.id] = response.data.data.splice(0, 90);
                }

                for (let guildId of Object.keys(this.metrics)) {
                    let guild = this.selectedGuilds.find(guild => guild.id == guildId);

                    if (guild == undefined) {
                        delete this.metrics[guildId];
                    }
                }

                this.metricDates = [];
                if (this.selectedGuilds.length > 0) {
                    this.metricDates = Object.values(this.metrics).sort((v1, v2) => {
                        return v1.length > v2.length ? -1 : 1;
                    })[0].map(metric => moment(metric.created_at).format("DD MMM YYYY - hh:mm"));

                    let totalItems = this.metricDates.length;

                    for (let guildId of Object.keys(this.metrics)) {
                        if (this.metrics[guildId].length < totalItems) {
                            for (let i = this.metrics[guildId].length; i < totalItems; i++) {
                                this.metrics[guildId].push(null)
                            }
                        }
                    }

                }

                this.isLoading = false;
            }
        },
        computed: {
            skillsMetrics() {
                let guilds = {};
                for (let guild of this.selectedGuilds) {
                    guilds[guild.name] = this.metrics[guild.id].map(metric => {
                        return metric == null ? null : metric.average_skill_progress
                    });
                }
                return guilds;
            },
        },
        watch: {
            selectedGuilds(state) {
                if (this.isLoading) {
                    return;
                }

                let queryParam = state.map(guild => guild.id).join('.');
                let paths = this.$route.path.split('/');
                let uri = paths.length > 2 ? paths.splice(0, paths.length - 1).join('/') : paths.join('/');

                history.pushState({}, null, `${uri}/${queryParam}`);

                this.loadMetrics();
            }
        }
    };
</script>