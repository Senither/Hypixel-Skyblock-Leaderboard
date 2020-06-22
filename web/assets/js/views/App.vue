<template>
    <div class="container">
        <loading
            v-if="isLoading"
            :message="message"
        />

        <div class="columns" v-else>
            <div class="column has-text-centered">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import Loading from '../components/Loading';

    import Store from '../store';

    export default {
        components: {
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
