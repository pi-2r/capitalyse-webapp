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
import SettingsPage from "./pages/settings/SettingsPage.vue";
import EditPage from "./pages/edit/EditPage.vue";

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
            path: '/portfolios/new',
            component: UploadFilesPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/:id',
            component: DashboardPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/:id/deposits',
            component: DepositsPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/:id/fees',
            component: FeesPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/:id/trading',
            component: TradingPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/portfolios',
            component: PortfoliosPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/settings',
            component: SettingsPage,
            meta: { requiresAuth: true },
        },
        {
            path: '/portfolios/edit/:id',
            component: EditPage,
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
        next('/portfolios')
    } else {
        next()
    }
});

export default router;