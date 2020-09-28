<template>
    <div>
        <section class="hero has-text-centered has-no-background">
            <div class="hero-body">
                <div class="container" v-if="isLoading">
                    <loading :message="'Loading player history'" />
                </div>

                <div class="container" v-else-if="history.length == 0">
                    <h1 class="title is-1">
                        Found no player history!
                    </h1>
                    <h4 class="subtitle is-4">
                        Found no player history for any player with an UUID of <i>{{ uuid }}</i>
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
                        {{ username }} History
                    </h1>

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
                        <div class="message-header is-clickable" v-on:click="viewGuild(record)">
                            <div class="columns is-fullwidth">
                                <div class="column has-text-left">
                                    <span class="tag is-large" :class="{
                                        'is-success': record.type == 0,
                                        'is-danger': record.type == 1,
                                    }">
                                        {{ record.type == 0 ? 'Joined' : 'Left' }}
                                    </span>
                                    <span style="font-size: 1.5rem">
                                        {{ record.guild_name }}
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
    import Loading from '@components/Loading';
    import moment from 'moment';

    export default {
        components: {
            Loading,
        },
        mounted() {
            let uuid = this.$route.params.uuid ?? null;
            if (uuid == null) {
                return this.$router.push({
                    name: 'landing-page'
                });
            }

            this.uuid = uuid;

            axios.get(`history?uuid=${uuid}`).then(response => {
                this.history = response.data.data.map(record => {
                        record.created_at_humanized = moment(record.created_at)
                            .toNow()
                            .split(' ')
                            .splice(1)
                            .join(' ') + ' ago';

                        record.created_at = moment(record.created_at);

                        return record;
                    });

                this.isLoading = false;
            });
        },
        data() {
            return {
                isLoading: true,
                history: [],
                uuid: null,
            };
        },
        methods: {
            viewGuild(record) {
                return this.$router.push({
                    name: 'guilds.show',
                    params: {
                        id: record.guild_id,
                    },
                });
            },
        },
        computed: {
            username() {
                return this.history[0].username;
            }
        }
    }
</script>
