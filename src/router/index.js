import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Bills from '../views/Bills.vue'
import Bill from '../views/Bill.vue'
import Accounts from '../views/Accounts.vue'
import Account from '../views/Account.vue'
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
    path: '/bill/:id',
    name: 'Bill',
    props: true,
    component: Bill
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Accounts
  },
  {
    path: '/account/:id',
    name: 'Account',
    props: true,
    component: Account
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
