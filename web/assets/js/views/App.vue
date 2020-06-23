<template>
    <div>
        <div class="container">
            <transition-page>
                <loading
                    v-if="isLoading"
                    :message="message"
                />

                <router-view v-else></router-view>
            </transition-page>
        </div>

        <transition-page :type="'slide-from-bottom'">
            <footer class="footer" v-if="! isLoading">
                <div class="content has-text-centered">
                    <p>
                        Created by <a href="https://senither.com/">Alexis Tan</a>, powered by <a href="https://bulma.io/">Bulma</a> and <a href="https://vuejs.org/">VueJS</a>, theme by <a href="https://jenil.github.io/bulmaswatch/">Bulmaswatch</a>.
                        <br>Get the <a href="https://github.com/Senither/Hypixel-Skyblock-Leaderboard">source code</a> on <a href="https://github.com/Senither/Hypixel-Skyblock-Leaderboard">GitHub</a>.
                    </p>
                </div>
            </footer>
        </transition-page>
    </div>
</template>

<script>
    import TransitionPage from '../components/TransitionPage';
    import Loading from '../components/Loading';

    import Store from '../store';

    export default {
        components: {
            TransitionPage,
            Loading,
        },
        mounted() {
            axios.get('/stats').then(response => {
                Store.put('stats', response.data.data);

                this.message = 'Loading guilds...';

                return axios.get('/');
            }).then(response => {
                this.message = 'Calculating ranks...';

                let guilds = response.data.data.sort((v1, v2) => {
                    return v2.average_skill_progress > v1.average_skill_progress ? 1 : -1;
                }).map((guild, index) => {
                    guild.skills_rank = index + 1;

                    return guild;
                }).sort((v1, v2) => {
                    return v2.average_slayer > v1.average_slayer ? 1 : -1;
                }).map((guild, index) => {
                    guild.slayers_rank = index + 1;

                    return guild;
                });

                Store.put('guilds', guilds);

                this.isLoading = false;
            });
        },
        data() {
            return {
                isLoading: true,
                message: 'Loading stats...',
            };
        }
    }
</script>
