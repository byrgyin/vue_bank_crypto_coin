import { createRouter, createWebHistory } from 'vue-router';
import LogInView from "@/views/LogInView.vue";

const routes = [
  {
    path: '/',
    name: 'login',
    component: LogInView,
  },
  {
    path: '/atms',
    name: 'atms',
    component: () => import('../views/AtmsView.vue'),
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('../views/AccountsView.vue'),
  },
  {
    path: '/currency',
    name: 'currency',
    component: () => import('../views/CurrencyView.vue'),
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogInView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
