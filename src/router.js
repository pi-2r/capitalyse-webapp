import { createRouter, createWebHistory } from 'vue-router'
import store from './store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/login"
        },
        {
            path: "/portfolios",
            component: () => import("./pages/portfolios/PortfoliosPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/signup",
            component: () => import("./pages/signup/SignupPage.vue"),
            meta: { requiresUnauth: true },
        },
        {
            path: "/login",
            component: () => import("./pages/login/LoginPage.vue"),
            meta: { requiresUnauth: true },
        },
        {
            path: "/portfolios/new",
            component: () => import("./pages/addportfolio/UploadFilesPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/dashboard/demo",
            component: () => import("./pages/demo/DemoDashboardPage.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: "/dashboard/demo/deposits",
            component: () => import("./pages/demo/DemoDepositsPage.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: "/dashboard/demo/fees",
            component: () => import("./pages/demo/DemoFeesPage.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: "/dashboard/demo/trading",
            component: () => import("./pages/demo/DemoTradingPage.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: "/dashboard/:id",
            component: () => import("./pages/dashboard/DashboardPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/dashboard/:id/deposits",
            component: () => import("./pages/deposits/DepositsPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/dashboard/:id/fees",
            component: () => import("./pages/fees/FeesPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/dashboard/:id/trading",
            component: () => import("./pages/trading/TradingPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/settings",
            component: () => import("./pages/settings/SettingsPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/:notFound(.*)",
            component: () => import("./pages/error/NotFoundPage.vue"),
        },
    ],
});

const root = document.querySelector(":root");

router.beforeEach((to, _2, next) => {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        next('/login')
    } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
        next('/portfolios')
    } else {
        next()
    }
});

router.afterEach((to) => {
    root.scrollTo(0, 0);
    let theme = localStorage.getItem('theme');

    if (!to.meta.requiresLightmode) {
        root.setAttribute("data-theme", theme);
    } else {
        root.setAttribute("data-theme", 'light');
    }

});

export default router;