import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import routes from './Routes'

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
