import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import pagelist from '@/components/pagelist'
import edit from '@/components/edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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
        }
      ]
    }
  ]
})
