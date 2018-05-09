import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import pagelist from '@/components/pagelist'
import edit from '@/components/edit'
import lander from '@/components/lander'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/',
          name: 'pagelist',
          component: pagelist
        },
        {
          path: '/edit',
          name: 'edit',
          component: edit
        },
        {
          path: '/lander',
          name: 'lander',
          component: lander
        }
      ]
    }
  ]
})
