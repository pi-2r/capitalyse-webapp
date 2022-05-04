import { createRouter, createWebHistory } from 'vue-router'

import store from './store';

import PortfoliosPage from "./pages/portfolios/PortfoliosPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/portfolios',
        },
        {
            path: '/portfolios',
            component: PortfoliosPage,
            meta: { requiresAuth: true },
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
            path: '/portfolios/new',
            component: () => import("./pages/upload/UploadFilesPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/:id',
            component: () => import('./pages/dashboard/DashboardPage.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/:id/deposits',
            component: () => import("./pages/dashboard/deposits/DepositsPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/:id/fees',
            component: () => import('./pages/dashboard/fees/FeesPage.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/:id/trading',
            component: () => import('./pages/dashboard/trading/TradingPage.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/settings',
            component: () => import('./pages/settings/SettingsPage.vue'),
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
        next('/portfolios')
    } else {
        next()
    }
});

export default router;