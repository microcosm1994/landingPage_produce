import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import login from '@/components/login'
import home from '@/components/home'
import pagelist from '@/components/pagelist'
import edit from '@/components/edit'
import lander from '@/components/lander'
import register from '@/components/register'
import users from '@/components/users'

Vue.use(Router)

const router = new Router({
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
        },
        {
          path: '/register',
          name: 'register',
          component: register
        },
        {
          path: '/users',
          name: 'users',
          component: users
        }
      ]
    }
  ]
})
router.afterEach((to, from, next) => {
  console.log(store)
  let loginstatus = store.state.loginstatus
  let username = store.state.users.username
  if (!loginstatus) {
    router.push({name: 'login'})
  } else {
    if (username !== 'admin') {
      if (to.name === 'register' || to.name === 'users') {
        router.push({path: from.path})
      }
    }
  }
})
export default router
