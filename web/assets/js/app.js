
import Vue from 'vue';
import Axios from 'axios';
import router from './router';

window.axios = Axios;

import App from './views/App';

const app = new Vue({
    el: '#app',
    components: {
        App
    },
    router
});
