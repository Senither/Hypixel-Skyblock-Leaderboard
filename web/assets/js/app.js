
import Vue from 'vue';

import Axios from 'axios';
import config from './config';

window.axios = Axios.create({
    baseURL: config.apiUrl,
    timeout: 10000,
});

Vue.mixin({
    methods: {
        formatNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
});

import router from './router';
import App from './views/App';

const app = new Vue({
    el: '#app',
    components: {
        App
    },
    router
});
