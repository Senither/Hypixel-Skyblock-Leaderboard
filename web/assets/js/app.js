
import Vue from 'vue';
import { Taginput } from 'buefy';

import Axios from 'axios';
import config from './config';

window.axios = Axios.create({
    baseURL: config.apiUrl,
    timeout: 10000,
});

Vue.use(Taginput);

Vue.mixin({
    methods: {
        formatNumber(number, decimals = 0) {
            number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (decimals > 0) {
                let remaining = number.split('.')[1] ?? '0';
                for (let i = remaining.length; i < decimals; i++) {
                    remaining += '0';
                }
                return number.split('.')[0] + '.' + remaining;
            }
            return number;
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
