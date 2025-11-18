import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

/**
 * Router configuration for the application.
 *
 * The router only loads components when their corresponding routes are accessed.
 * This is achieved through route level code-splitting using dynamic imports.
 */
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
            component: () => import('../views/TabSearchView.vue'),
        },
        {
            path: '/tab/create',
            name: 'tabCreate',
            component: () => import('../views/TabCreateView.vue'),
        },
        {
            path: '/tab/:id',
            name: 'tab',
            component: () => import('../views/TabView.vue'),
        },
        {
            path: '/tab/:id/edit',
            name: 'tabEdit',
            component: () => import('../views/TabEditView.vue'),
        },

        {
            path: '/tab/:id/delete',
            name: 'tabDelete',
            component: () => import('../views/TabDeleteView.vue'),
        },

        {
            path: '/tab/:id/format',
            name: 'tabFormat',
            component: () => import('../views/TabFormatView.vue'),
        },

        {
            path: '/tab/:id/transpose',
            name: 'tabTranspose',
            component: () => import('../views/TabTransposeView.vue'),
        },
        {
            path: '/artistSearch',
            name: 'artistSearch',
            component: () => import('../views/ArtistSearchView.vue'),
        },
        {
            path: '/artist/:id',
            name: 'artist',
            component: () => import('../views/ArtistView.vue'),
        },
        {
            path: '/artist/:id/edit',
            name: 'artistEdit',
            component: () => import('../views/ArtistEditView.vue'),
        },
        {
            path: '/artist/:id/delete',
            name: 'artistDelete',
            component: () => import('../views/ArtistDeleteView.vue'),
        },
        {
            path: '/tagSearch',
            name: 'tagSearch',
            component: () => import('../views/TagSearchView.vue'),
        },
        {
            path: '/tag/create',
            name: 'tagCreate',
            component: () => import('../views/TagCreateView.vue'),
        },
        {
            path: '/tag/:id',
            name: 'tag',
            component: () => import('../views/TagView.vue'),
        },
        {
            path: '/tag/:id/edit',
            name: 'tagEdit',
            component: () => import('../views/TagEditView.vue'),
        },
        {
            path: '/tag/:id/delete',
            name: 'tagDelete',
            component: () => import('../views/TagDeleteView.vue'),
        },
    ],
});

export default router;
