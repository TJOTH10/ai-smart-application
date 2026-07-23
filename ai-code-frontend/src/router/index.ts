import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/AboutView.vue'),
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: () => import('../pages/user/LoginPage.vue'),
    },
    {
      path: '/user/register',
      name: 'userRegister',
      component: () => import('../pages/user/RegisterPage.vue'),
    },
    {
      path: '/user/profile',
      name: 'userProfile',
      component: () => import('../pages/user/ProfilePage.vue'),
    },
    {
      path: '/app/chat/:appId',
      name: 'appChat',
      component: () => import('../pages/app/AppChatPage.vue'),
    },
    {
      path: '/app/edit/:appId',
      name: 'appEdit',
      component: () => import('../pages/app/AppEditPage.vue'),
    },
    {
      path: '/admin/user',
      name: 'adminUser',
      component: () => import('../pages/admin/UserManagePage.vue'),
    },
    {
      path: '/admin/app',
      name: 'adminApp',
      component: () => import('../pages/admin/AppManagePage.vue'),
    },
  ],
})

export default router
