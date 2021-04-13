import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Bills from '../views/Bills.vue'
import Accounts from '../views/Accounts.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bills',
    name: 'Bills',
    component: Bills
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Accounts
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
