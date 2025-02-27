import { createRouter, createWebHistory } from 'vue-router'

import LoginVue from '@/views/login/LoginPage.vue'
import RegisterPage from '@/views/login/RegisterPage.vue'
import LayoutVue from '@/views/LayoutPage.vue'

import ActivityVue from '@/views/admin/ActivityAdminPage.vue'
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
      path:'/register',
      name:'register',
      component:RegisterPage
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
          path:'/admin/form/detail/:queryId',
          component:FormDetailVue
        },
        {
          path:'/admin/form/create',
          component:FormCreateVue
        },
        {
          path:'/admin/activity',
          component:ActivityVue
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
