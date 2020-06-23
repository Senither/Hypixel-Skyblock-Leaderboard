<template>
    <div>
        <section class="hero has-text-centered has-no-background" v-if="guild != null">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title is-1">
                        {{ guild.name }} Metrics
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
                        </div>
                    </div>

                    <h2 class="subtitle">
                        <a href="#"><i class="fas fa-arrow-alt-circle-left"></i> Return to guild list</a>
                    </h2>
                </div>
            </div>
        </section>

        <loading
            v-if="isLoading"
            :message="'Loading metrics & players data...'"
        />

        <div v-else>

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
    import Loading from '../../components/Loading';
    import Player from '../../components/Player';

    import Store from '../../store';

    export default {
        components: {
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

                return axios.get(`/players/${this.guild.id}`);
            }).then(response => {
                this.players = response.data.data.map(player => {
                    player.collaps = true;

                    return player;
                });

                this.isLoading = false;
            })
        },
        data() {
            return {
                isLoading: true,
                metrics: null,
                players: null,
                playerSortMethod: 'average_skill_progress',
            };
        },
        methods: {
            clickSort(method) {
                this.playerSortMethod = method;
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
