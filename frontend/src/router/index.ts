import { createRouter, createWebHistory } from 'vue-router';
import { useAuthoriseStore } from '@/stores/store.ts';
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
    meta:{requiresAuth: true},
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('../views/AccountsView.vue'),
    meta:{requiresAuth: true},
  },
  {
    path: '/currency',
    name: 'currency',
    component: () => import('../views/CurrencyView.vue'),
    meta:{requiresAuth: true},
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
});

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){
    if(!useAuthoriseStore().authoriseUser){
      next({name: 'login'});
    } else{
      next();
    }
  } else {
    next();
  }
});

export default router
