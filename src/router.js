import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from "./pages/dashboard/DashboardPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
            component: DashboardPage,
        },
        {
            path: '/dashboard',
            component: DashboardPage,
        },
        {
            path: '/dashboard/deposits',
            component: () => import('./pages/deposits/DepositsPage.vue'),
        },
        {
            path: '/dashboard/fees',
            component: () => import('./pages/fees/FeesPage.vue'),
        },
        {
            path: '/dashboard/trading',
            component: () => import('./pages/trading/TradingPage.vue'),
        },
        {
            path: '/:notFound(.*)',
            component: null,
        },
    ],
})

router.beforeEach((to, _, next) => {
    console.log('beforeEach', to);
    next();
});

export default router;