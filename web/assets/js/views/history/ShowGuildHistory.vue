<template>
    <div>
        <section class="hero has-text-centered has-no-background">
            <div class="hero-body">
                <div class="container" v-if="isLoading">
                    <loading :message="'Loading player history'" />
                </div>

                <div class="container" v-else-if="history.length == 0">
                    <h1 class="title is-1">
                        Found no guild history!
                    </h1>
                    <h4 class="subtitle is-4">
                        Found no player history for any guild with an id of <i>{{ id }}</i>
                    </h4>
                    <p>
                        <router-link :to="{ name: 'landing-page' }" class="button">
                            <span class="icon is-small">
                                <i class="fas fa-arrow-alt-circle-left"></i>
                            </span>
                            <span>Return to welcome notes</span>
                        </router-link>
                    </p>
                </div>

                <div class="container" v-else>
                    <h1 class="title is-1">
                        <a @click="viewGuild">{{ name }} History</a>
                    </h1>
                    <h3 class="subtitle is-3">
                        Guild join and leave history
                    </h3>

                    <p>
                        <router-link :to="{ name: 'landing-page' }" class="button">
                            <span class="icon is-small">
                                <i class="fas fa-arrow-alt-circle-left"></i>
                            </span>
                            <span>Return to welcome notes</span>
                        </router-link>
                    </p>

                    <hr>

                    <article class="message" v-for="record of history">
                        <div class="message-header is-clickable" v-on:click="viewPlayer(record)">
                            <div class="columns is-fullwidth">
                                <div class="column has-text-left">
                                    <span class="tag is-large" :class="{
                                        'is-success': record.type == 0,
                                        'is-danger': record.type == 1,
                                    }">
                                        {{ record.type == 0 ? 'Joined' : 'Left' }}
                                    </span>
                                    <span style="font-size: 1.5rem">
                                        {{ record.username }}
                                    </span>
                                </div>
                                <div class="column has-text-right">
                                    <p class="has-text-grey-light">
                                        {{ record.created_at_humanized }}
                                        <br>{{ record.created_at }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </article>

                    <hr v-if="paginate != null">

                    <pagination
                        class="box"
                        v-if="paginate != null"
                        :pagination="paginate"
                        @go-to-page="handlePaginationNavigation"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
    .is-fullwidth {
        width: 100%;
    }
    .message-header {
        border-radius: 0.4em;
    }
    .tag {
        width: 5em;
        margin-right: 16px;
    }
</style>

<script>
    import Pagination from '@components/Pagination';
    import Loading from '@components/Loading';
    import moment from 'moment';

    export default {
        components: {
            Pagination,
            Loading,
        },
        mounted() {
            let id = this.$route.params.id ?? null;
            if (id == null) {
                return this.$router.push({
                    name: 'landing-page'
                });
            }

            this.id = id;

            this.loadHistory();
        },
        data() {
            return {
                page: 1,
                isLoading: true,
                history: [],
                paginate: null,
                id: null,
            };
        },
        methods: {
            handlePaginationNavigation(page) {
                this.page = page;

                this.loadHistory();
            },
            loadHistory() {
                axios.get(`history?guild_id=${this.id}&perPage=10&page=${this.page}`).then(response => {
                    this.history = response.data.data.map(record => {
                            record.created_at_humanized = moment(record.created_at)
                                .toNow()
                                .split(' ')
                                .splice(1)
                                .join(' ') + ' ago';

                            record.created_at = moment(record.created_at);

                            return record;
                        });
                    this.paginate = response.data.paginate;

                    this.isLoading = false;
                });
            },
            viewGuild() {
                return this.$router.push({
                    name: 'guilds.show',
                    params: {
                        id: this.history[0].guild_id,
                    },
                });
            },
            viewPlayer(record) {
                return this.$router.push({
                    name: 'players.show',
                    params: {
                        uuid: record.uuid,
                    },
                });
            }
        },
        computed: {
            name() {
                return this.history[0].guild_name;
            }
        }
    }
</script>
