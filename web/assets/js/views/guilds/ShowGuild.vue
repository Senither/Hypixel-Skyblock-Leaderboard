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

                    <div class="columns" v-if="hasSocials">
                        <div class="column">
                            <a
                                v-if="guild.meta.hasOwnProperty('discord')"
                                :href="'https://discord.gg/' + guild.meta.discord"
                                class="button"
                                target="blank"
                                style="background-color: #8B9BD4"
                            >
                                <span class="icon is-small">
                                    <i class="fab fa-discord"></i>
                                </span>
                                <span>Join Guild Discord</span>
                            </a>

                            <hr>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column has-text-centered">
                            <h2 class="subtitle">
                                <router-link :to="{ name: 'guilds' }" class="button">
                                    <span class="icon is-small">
                                        <i class="fas fa-arrow-alt-circle-left"></i>
                                    </span>
                                    <span>Return to guild list</span>
                                </router-link>

                                &nbsp;&nbsp;&nbsp;

                                <router-link :to="{ name: 'history.guild', params: { ids: this.guild.id } }" class="button">
                                    <span>View History</span>
                                    <span class="icon is-small">
                                        <i class="fas fa-align-right"></i>
                                    </span>
                                </router-link>

                                &nbsp;&nbsp;&nbsp;

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

        <div>
            <div class="tabs is-large is-centered">
                <ul>
                    <li
                        :class="{ 'is-active': selectedView == views.PLAYERS }"
                        @click="selectView(views.PLAYERS)"
                    >
                        <a>Players</a>
                    </li>
                    <li
                        :class="{ 'is-active': selectedView == views.METRICS }"
                        @click="selectView(views.METRICS)"
                    >
                        <a>Metrics</a>
                    </li>
                </ul>
            </div>

            <div v-if="selectedView == views.METRICS">
                <guild-metrics :id="guild.id" />
            </div>

            <div v-else-if="selectedView == views.PLAYERS">
                <guild-players :id="guild.id" />
            </div>
        </div>
    </div>
</template>

<script>
    import GuildPlayers from './partials/GuildPlayers';
    import GuildMetrics from './partials/GuildMetrics';
    import Store from '@/store';

    export default {
        components: {
            GuildPlayers,
            GuildMetrics,
        },
        mounted() {
            if (this.guild == null) {
                return this.$router.push({
                    name: 'guilds'
                });
            }
        },
        data() {
            return {
                isLoading: true,
                selectedView: 0,
                views: {
                    PLAYERS: 0,
                    METRICS: 1,
                },
            };
        },
        methods: {
            selectView(view) {
                this.selectedView = view;
            },
        },
        computed: {
            guild() {
                const id = this.$route.params.id;

                let guild = Store.get('guilds').filter(guild => {
                    return guild.id == id;
                });

                return guild.length == 0 ? null : guild[0];
            },
            hasSocials() {
                const { meta } = this.guild;

                // Can add more social links here so all of them
                // can be checked for at the same time.

                return meta.hasOwnProperty('discord');
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
        }
    }
</script>
