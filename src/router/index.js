import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Market',
    component: () => import('@/pages/Market.vue')
  },
  {
    path: '/detail/:code',
    name: 'Detail',
    component: () => import('@/pages/Detail.vue'),
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