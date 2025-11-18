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
            component: () => import('../views/tab/TabSearchView.vue'),
        },
        {
            path: '/tab/create',
            name: 'tabCreate',
            component: () => import('../views/tab/TabCreateView.vue'),
        },
        {
            path: '/tab/:id',
            name: 'tab',
            component: () => import('../views/tab/TabView.vue'),
        },
        {
            path: '/tab/:id/edit',
            name: 'tabEdit',
            component: () => import('../views/tab/TabEditView.vue'),
        },

        {
            path: '/tab/:id/delete',
            name: 'tabDelete',
            component: () => import('../views/tab/TabDeleteView.vue'),
        },

        {
            path: '/tab/:id/format',
            name: 'tabFormat',
            component: () => import('../views/tab/TabFormatView.vue'),
        },

        {
            path: '/tab/:id/transpose',
            name: 'tabTranspose',
            component: () => import('../views/tab/TabTransposeView.vue'),
        },
        {
            path: '/artistSearch',
            name: 'artistSearch',
            component: () => import('../views/artist/ArtistSearchView.vue'),
        },
        {
            path: '/artist/create',
            name: 'artistCreate',
            component: () => import('../views/artist/ArtistCreateView.vue'),
        },
        {
            path: '/artist/:id',
            name: 'artist',
            component: () => import('../views/artist/ArtistView.vue'),
        },
        {
            path: '/artist/:id/edit',
            name: 'artistEdit',
            component: () => import('../views/artist/ArtistEditView.vue'),
        },
        {
            path: '/artist/:id/delete',
            name: 'artistDelete',
            component: () => import('../views/artist/ArtistDeleteView.vue'),
        },
        {
            path: '/tagSearch',
            name: 'tagSearch',
            component: () => import('../views/tag/TagSearchView.vue'),
        },
        {
            path: '/tag/create',
            name: 'tagCreate',
            component: () => import('../views/tag/TagCreateView.vue'),
        },
        {
            path: '/tag/:id',
            name: 'tag',
            component: () => import('../views/tag/TagView.vue'),
        },
        {
            path: '/tag/:id/edit',
            name: 'tagEdit',
            component: () => import('../views/tag/TagEditView.vue'),
        },
        {
            path: '/tag/:id/delete',
            name: 'tagDelete',
            component: () => import('../views/tag/TagDeleteView.vue'),
        },
    ],
});

export default router;
