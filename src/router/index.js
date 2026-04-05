import { createRouter, createWebHistory } from 'vue-router'
import LoginView    from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import UsersView    from '@/views/UsersView.vue'
import JobsView     from '@/views/JobsView.vue'
import SystemView   from '@/views/SystemView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login',  name: 'login',     component: LoginView,     meta: { public: true } },
    { path: '/',       name: 'dashboard', component: DashboardView },
    { path: '/users',  name: 'users',     component: UsersView },
    { path: '/jobs',   name: 'jobs',      component: JobsView },
    { path: '/system', name: 'system',    component: SystemView }
  ]
})

// Auth guard — token yoksa login'e yönlendir
router.beforeEach((to) => {
  const isLoggedIn = !!localStorage.getItem('admin_token')
  if (!to.meta.public && !isLoggedIn) return { name: 'login' }
  if (to.name === 'login' && isLoggedIn) return { name: 'dashboard' }
})

export default router
