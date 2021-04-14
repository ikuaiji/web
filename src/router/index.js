import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Bills from '../views/Bills.vue'
import Accounts from '../views/Accounts.vue'
import Reports from '../views/Reports.vue'

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
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
