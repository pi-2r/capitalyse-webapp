import { createRouter, createWebHistory } from 'vue-router'
import store from './store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("./pages/landing/LandingPage.vue"),
            meta: { requiresLightmode: true },
        },
        {
            path: "/portfolios",
            component: () => import("./pages/portfolios/PortfoliosPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/signup",
            component: () => import("./pages/signup/SignupPage.vue"),
            meta: { requiresUnauth: true, requiresLightmode: true },
        },
        {
            path: "/login",
            component: () => import("./pages/login/LoginPage.vue"),
            meta: { requiresUnauth: true, requiresLightmode: true },
        },
        {
            path: "/portfolios/new",
            component: () => import("./pages/addportfolio/UploadFilesPage.vue"),
            meta: { requiresAuth: true },
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
        console.log('aftereach');
        root.setAttribute("data-theme", theme);
    } else {
        root.setAttribute("data-theme", 'light');
    }
        
});
    
export default router;