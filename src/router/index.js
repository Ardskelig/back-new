import { createRouter, createWebHistory } from 'vue-router'

import LoginVue from '@/views/LayoutPage.vue'
import LayoutVue from '@/views/LayoutPage.vue'


import ClubVue from '@/views/admin/ClubAdminPage.vue'

import FormVue from '@/views/form/FormAdminPage.vue'
import FormDetailVue from '@/views/form/FormDetailPage.vue'
import FormCreateVue from '@/views/form/FormCreatePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/login',
      name:'login',
      component:LoginVue
    },
    {
      path:'/',
      name:'home',
      component:LayoutVue,
      redirect:'/admin/form',
      children:[
        {
          path:'/admin/form',
          component:FormVue
        },
        {
          path:'/admin/form/detail/:id',
          component:FormDetailVue
        },
        {
          path:'/admin/form/create',
          component:FormCreateVue
        },
        {
          path:'/admin/club',
          component:ClubVue
        },
      ]
    }
  ],
})

export default router
