import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from "./pages/dashboard/DashboardPage.vue";
import store from './store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
            component: DashboardPage,
        },
        {
            path: '/signup',
            component: () => import('./pages/auth/SignupPage.vue'),
            meta: { requiresUnauth: true },
        },
        {
            path: '/login',
            component: () => import('./pages/auth/LoginPage.vue'),
            meta: { requiresUnauth: true },
        },
        {
            path: '/upload',
            component: () => import('./pages/upload/UploadFilesPage.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard',
            component: DashboardPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/deposits',
            component: () => import('./pages/deposits/DepositsPage.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/fees',
            component: () => import('./pages/fees/FeesPage.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/trading',
            component: () => import('./pages/trading/TradingPage.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/:notFound(.*)',
            component: () => import('./pages/notfound/NotFoundPage.vue'),
        },
    ],
})

router.beforeEach((to, _2, next) => {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        next('/login')
    } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
});

export default router;