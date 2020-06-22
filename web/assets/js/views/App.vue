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
    import LoadingReport from './LoadingReport';
    import Report from './Report';
    export default {
        components: {
            LoadingReport,
            Report
        },
        mounted() {
            this.id = window.location.href.split('/').pop();
            this.stage = this.stages.LOADING_REPORT;
        },
        data() {
            return {
                report: null,
                stage: null,
                stages: {
                    LOADING_REPORT: 0,
                    HAS_REPORT: 1,
                },
                id: null,
            };
        },
        methods: {
            handleLoadedReport(event) {
                this.report = event.report;
                this.stage = this.stages.HAS_REPORT;
            }
        }
    };
</script>

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
                Store.put('guilds', response.data.data);

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
