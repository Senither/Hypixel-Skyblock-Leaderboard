<template>
    <div>
        <section class="hero has-text-centered has-no-background">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Hypixel SkyBlock Leaderboard
                    </h1>
                    <h2 class="subtitle">Welcome to the Hypixel SkyBlock leaderboard!</h2>

                    <h5 class="title is-5">The leaderboard is tracking</h5>

                    <nav class="level">
                        <div class="level-item has-text-centered">
                            <div>
                                <p class="heading">Guilds</p>
                                <p class="title">{{ formatNumber(stats.guilds) }}</p>
                            </div>
                        </div>
                        <div class="level-item has-text-centered">
                            <div>
                                <p class="heading">Guild Metrics</p>
                                <p class="title">{{ formatNumber(stats.guilds_metrics) }}</p>
                            </div>
                        </div>
                        <div class="level-item has-text-centered">
                            <div>
                                <p class="heading">Players</p>
                                <p class="title">{{ formatNumber(stats.players) }}</p>
                            </div>
                        </div>
                        <div class="level-item has-text-centered">
                            <div>
                                <p class="heading">Player Metrics</p>
                                <p class="title">{{ formatNumber(stats.players_metrics) }}</p>
                            </div>
                        </div>
                    </nav>

                    <div class="columns">
                        <div class="column">
                            <router-card-button
                                :name="'Guild Leaderboard'"
                                :icon="'fas fa-landmark'"
                                :go-to="'guilds'"
                            />
                        </div>
                        <div class="column">
                            <router-card-button
                                :name="'Player Leaderboard'"
                                :icon="'fas fa-users'"
                                :go-to="'players'"
                            />
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column">
                            <h3 class="subtitle is-3 has-text-centered">Latest guild join & leave history</h3>

                            <div class="box" v-if="history.length > 0">
                                <table class="table is-striped is-hoverable is-fullwidth">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Guild</th>
                                            <th>Created at</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="record of history">
                                            <td>
                                                <router-link :to="{
                                                    name: 'history.player',
                                                    params: {
                                                        uuid: record.uuid,
                                                    }
                                                }">
                                                    <span v-if="record.username == null || record.username.length == 0">
                                                        <i class="fas fa-spinner fa-spin"></i> <i>Resolving Username</i>
                                                    </span>
                                                    <span v-else>{{ record.username }}</span>
                                                </router-link>
                                            </td>
                                            <td>
                                                <span class="tag" :class="{
                                                    'is-success': record.type == 0,
                                                    'is-danger': record.type == 1,
                                                }">
                                                    {{ record.type == 0 ? 'Joined' : 'Left' }}
                                                </span>
                                            </td>
                                            <td>
                                                <router-link :to="{
                                                    name: 'history.guild',
                                                    params: {
                                                        id: record.guild_id,
                                                    }
                                                }">{{ record.guild_name }}</router-link>
                                            </td>
                                            <td>{{ record.created_at_humanized }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <pagination
                                    v-if="paginate != null"
                                    :pagination="paginate"
                                    @go-to-page="handlePaginationNavigation"
                                />
                            </div>

                            <div class="box has-text-centered" v-else>
                                <p>There are currently no player history to display!</p>
                                <p>Try check back later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
    .title.is-5 {
        padding-top: 20px;
    }
</style>

<script>
    import RouterCardButton from '@components/RouterCardButton';
    import Pagination from '@components/Pagination';
    import Store from '@/store';
    import moment from 'moment';

    export default {
        components: {
            RouterCardButton,
            Pagination,
        },
        mounted() {
            this.loadHistory();
        },
        data() {
            return {
                page: 1,
                isLoading: false,
                history: [],
                paginate: null,
            };
        },
        methods: {
            handlePaginationNavigation(page) {
                this.page = page;

                this.loadHistory();
            },
            loadHistory() {
                if (this.isLoading) {
                    return;
                }

                this.isLoading = true;

                axios.get(`/history?perPage=10&page=${this.page}`).then(response => {
                    this.paginate = response.data.paginate;
                    this.history = response.data.data.map(record => {
                        record.created_at_humanized = moment(record.created_at)
                            .toNow()
                            .split(' ')
                            .splice(1)
                            .join(' ') + ' ago';

                        return record;
                    });

                    this.isLoading = false;
                });
            },
        },
        computed: {
            stats() {
                return Store.get('stats');
            }
        }
    }
</script>
