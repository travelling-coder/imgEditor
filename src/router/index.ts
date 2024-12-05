import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ps',
      name: 'ps',
      component: () => import('../views/PS.vue')
    },
    {
      path: '/',
      name: 'about',
      component: AboutView
    }
  ]
})

export default router
