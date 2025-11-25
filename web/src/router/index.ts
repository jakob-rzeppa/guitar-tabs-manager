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
            path: '/sheetSearch',
            name: 'sheetSearch',
            component: () => import('../views/sheet/SheetSearchView.vue'),
        },
        {
            path: '/sheet/create',
            name: 'sheetCreate',
            component: () => import('../views/sheet/SheetCreateView.vue'),
        },
        {
            path: '/sheet/:id',
            name: 'sheet',
            component: () => import('../views/sheet/SheetView.vue'),
        },
        {
            path: '/sheet/:id/edit',
            name: 'sheetEdit',
            component: () => import('../views/sheet/SheetEditView.vue'),
        },

        {
            path: '/sheet/:id/delete',
            name: 'sheetDelete',
            component: () => import('../views/sheet/SheetDeleteView.vue'),
        },

        {
            path: '/sheet/:id/format',
            name: 'sheetFormat',
            component: () => import('../views/sheet/SheetFormatView.vue'),
        },

        {
            path: '/sheet/:id/transpose',
            name: 'sheetTranspose',
            component: () => import('../views/sheet/SheetTransposeView.vue'),
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
