import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/counter'//导入pinia，设置路由守卫需要
import LoginVue from '@/views/login/LoginPage.vue'
import RegisterPage from '@/views/login/RegisterPage.vue'
import LayoutVue from '@/views/LayoutPage.vue'
import ChatBpmnVue from '@/views/admin/ChatBpmn.vue'
import ActivityVue from '@/views/admin/ActivityAdminPage.vue'

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
          path:'/admin/chat',
          component:ChatBpmnVue
        }
      ]
    }
  ],
})

// 🚀 添加全局前置守卫，检查用户是否已登录
// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore(); // 获取 Pinia 中的用户状态
//   const isAuthenticated = !!userStore.userDid; // 是否已登录

//   // 如果用户未登录，并且访问的不是登录或注册页面，则重定向到登录页面
//   if (!isAuthenticated && to.path !== '/login' && to.path !== '/register') {
//     next('/login'); // 重定向到登录页面
//   } else {
//     next(); // 允许访问
//   }
// });

export default router
