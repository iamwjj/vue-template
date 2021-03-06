import Vue from 'vue'
import Router from 'vue-router'
import { VueAxios } from '@/http'
import App from './App.vue'
import Home from '@/components/Home.vue'
import About from '@/components/About.vue'

Vue.use(Router)
Vue.use(VueAxios)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
    }, {
      path: '/about',
      component: About
    }
  ]
})

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
