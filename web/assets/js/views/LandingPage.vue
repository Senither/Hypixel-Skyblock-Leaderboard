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
                                :go-to="null"
                            />
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
    import Store from '../store';
    import RouterCardButton from '../components/RouterCardButton';

    export default {
        components: {
            RouterCardButton,
        },
        computed: {
            stats() {
                return Store.get('stats');
            }
        }
    }
</script>
