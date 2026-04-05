import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import UsersView from '@/views/UsersView.vue'
import JobsView from '@/views/JobsView.vue'
import SystemView from '@/views/SystemView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',        name: 'dashboard', component: DashboardView },
    { path: '/users',   name: 'users',     component: UsersView },
    { path: '/jobs',    name: 'jobs',      component: JobsView },
    { path: '/system',  name: 'system',    component: SystemView }
  ]
})

export default router
