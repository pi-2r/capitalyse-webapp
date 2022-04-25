import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from "./pages/dashboard/DashboardPage.vue";
import store from './store';

import UploadFilesPage from "./pages/upload/UploadFilesPage.vue";
import SignupPage from "./pages/auth/SignupPage.vue";
import LoginPage from "./pages/auth/LoginPage.vue";
import DepositsPage from "./pages/deposits/DepositsPage.vue";
import FeesPage from "./pages/fees/FeesPage.vue";
import TradingPage from "./pages/trading/TradingPage.vue";
import NotFoundPage from "./pages/notfound/NotFoundPage.vue";
import PortfoliosPage from "./pages/portfolios/PortfoliosPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/portfolios',
            component: DashboardPage,
        },
        {
            path: '/signup',
            component: SignupPage,
            meta: { requiresUnauth: true },
        },
        {
            path: '/login',
            component: LoginPage,
            meta: { requiresUnauth: true },
        },
        {
            path: '/upload',
            component: UploadFilesPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard',
            component: DashboardPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/deposits',
            component: DepositsPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/fees',
            component: FeesPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/trading',
            component: TradingPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/portfolios',
            component: PortfoliosPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/:notFound(.*)',
            component: NotFoundPage,
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