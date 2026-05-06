import { createRouter, createWebHistory } from 'vue-router'
import { useUsersStore } from '../stores/users'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../pages/UsersPage.vue'),
      beforeEnter: () => {
        const store = useUsersStore()
        if (!store.hasFetchedUsers) return { name: 'home' }
      },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../pages/HistoryPage.vue'),
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: () => import('../pages/UserDetailsPage.vue'),
      props: (route) => ({ id: route.params.id, source: 'users' }),
    },
    {
      path: '/history/:id',
      name: 'history-detail',
      component: () => import('../pages/UserDetailsPage.vue'),
      props: (route) => ({ id: route.params.id, source: 'history' }),
    },
  ],
})

export default router
