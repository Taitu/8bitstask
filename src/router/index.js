import { createRouter, createWebHistory } from 'vue-router'

import Market from '@/pages/Market.vue'
import Detail from '@/pages/Detail.vue'

const routes = [
  {
    path: '/',
    name: 'Market',
    component: Market,
  },
  {
    path: '/detail/:code',
    name: 'Detail',
    component: Detail,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router