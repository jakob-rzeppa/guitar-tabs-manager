import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/tabSearch',
            name: 'tabSearch',
            // route level code-splitting
            component: () => import('../views/TabSearchView.vue'),
        },
        {
            path: '/tab/:id',
            name: 'tab',
            // route level code-splitting
            component: () => import('../views/TabView.vue'),
        },
        {
            path: '/tab/:id/edit',
            name: 'tabEdit',
            // route level code-splitting
            component: () => import('../views/TabEditView.vue'),
        },

        {
            path: '/tab/:id/format',
            name: 'tabFormat',
            // route level code-splitting
            component: () => import('../views/FormatView.vue'),
        },
    ],
});

export default router;
