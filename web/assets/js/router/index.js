
import Vue from 'vue';
import VueRouter from 'Vue-router';

Vue.use(VueRouter);

import routes from './Routes';

const router = new VueRouter({
    mode: 'history',
    routes,
});

export default router;
