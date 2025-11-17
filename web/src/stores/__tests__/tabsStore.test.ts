import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useTabsStore } from '../tabsStore';
import type { ApiResponse, TabDto, TabListItemDto } from '@/types/dtos';
import * as apiModule from '@/services/api';

// Mock the API module
vi.mock('@/services/api', async () => {
    const actual = await vi.importActual<typeof apiModule>('@/services/api');
    return {
        ...actual,
        default: {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        },
        useApiInStore: vi.fn(async ({ store, apiCall, onSuccess }) => {
            store.loading = true;
            store.error = null;
            try {
                const response = await apiCall();
                onSuccess?.(response);
                return response.data;
            } catch (err) {
                store.error = err instanceof Error ? err.message : 'An unknown error occurred';
                throw err;
            } finally {
                store.loading = false;
            }
        }),
    };
});

const api = apiModule.default;

describe('tabsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    describe('state', () => {
        it('should have correct initial state', () => {
            const store = useTabsStore();

            expect(store.detailedTabs).toEqual({});
            expect(store.tabsList).toEqual([]);
            expect(store.loading).toBe(false);
            expect(store.error).toBeNull();
        });
    });

    describe('fetchAllTabs', () => {
        it('should fetch all tabs and update tabsList', async () => {
            const store = useTabsStore();
            const mockData: ApiResponse<TabListItemDto[]> = {
                content: [
                    {
                        id: 1,
                        title: 'Wonderwall',
                        artist: { id: 1, name: 'Oasis' },
                        tags: [{ id: 1, name: 'rock' }],
                    },
                    {
                        id: 2,
                        title: 'Hey Jude',
                        artist: { id: 2, name: 'The Beatles' },
                        tags: [],
                    },
                ],
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchAllTabs();

            expect(api.get).toHaveBeenCalledWith('/tabs');
            expect(store.tabsList).toHaveLength(2);
            expect(store.tabsList[0]).toEqual({
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [{ id: 1, name: 'rock' }],
            });
            expect(store.error).toBeNull();
        });

        it('should not refetch if data already loaded unless force is true', async () => {
            const store = useTabsStore();
            const mockData: ApiResponse<TabListItemDto[]> = {
                content: [
                    {
                        id: 1,
                        title: 'Wonderwall',
                        artist: { id: 1, name: 'Oasis' },
                        tags: [],
                    },
                ],
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchAllTabs();
            expect(api.get).toHaveBeenCalledTimes(1);

            await store.fetchAllTabs();
            expect(api.get).toHaveBeenCalledTimes(1); // Should not call again

            await store.fetchAllTabs({ force: true });
            expect(api.get).toHaveBeenCalledTimes(2); // Should call when forced
        });

        it('should set error when content is empty', async () => {
            const store = useTabsStore();
            vi.mocked(api.get).mockResolvedValue({ data: {} });

            await store.fetchAllTabs();

            expect(store.error).toBe('Request content is empty');
        });

        it('should handle API errors', async () => {
            const store = useTabsStore();
            vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

            await expect(store.fetchAllTabs()).rejects.toThrow('Network error');
            expect(store.error).toBe('Network error');
        });
    });

    describe('fetchTab', () => {
        it('should fetch a single tab with full details', async () => {
            const store = useTabsStore();
            const mockData: ApiResponse<TabDto> = {
                content: {
                    id: 1,
                    title: 'Wonderwall',
                    artist: { id: 1, name: 'Oasis' },
                    tags: [{ id: 1, name: 'rock' }],
                    capo: 2,
                    source_url: 'https://example.com',
                    content: 'E A D...',
                },
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchTab('1');

            expect(api.get).toHaveBeenCalledWith('/tabs/1');
            expect(store.detailedTabs['1']).toEqual({
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [{ id: 1, name: 'rock' }],
                capo: 2,
                sourceURL: 'https://example.com',
                content: 'E A D...',
            });
            expect(store.error).toBeNull();
        });

        it('should not refetch if tab already cached unless force is true', async () => {
            const store = useTabsStore();
            const mockData: ApiResponse<TabDto> = {
                content: {
                    id: 1,
                    title: 'Wonderwall',
                    artist: { id: 1, name: 'Oasis' },
                    tags: [],
                    capo: 2,
                    source_url: '',
                    content: 'E A D...',
                },
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchTab('1');
            expect(api.get).toHaveBeenCalledTimes(1);

            await store.fetchTab('1');
            expect(api.get).toHaveBeenCalledTimes(1); // Should not call again

            await store.fetchTab('1', { force: true });
            expect(api.get).toHaveBeenCalledTimes(2); // Should call when forced
        });

        it('should set error when content is empty', async () => {
            const store = useTabsStore();
            vi.mocked(api.get).mockResolvedValue({ data: {} });

            await store.fetchTab('1');

            expect(store.error).toBe('Request content is empty');
        });
    });

    describe('createTab', () => {
        it('should create a new tab and add to both caches', async () => {
            const store = useTabsStore();
            const mockData: ApiResponse<TabDto> = {
                content: {
                    id: 3,
                    title: 'New Song',
                    artist: { id: 1, name: 'Oasis' },
                    tags: [{ id: 1, name: 'rock' }],
                    capo: 0,
                    source_url: 'https://example.com',
                    content: 'C G Am F...',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockData });

            await store.createTab({
                title: 'New Song',
                artist: { id: 1, name: 'Oasis' },
                tags: [{ id: 1, name: 'rock' }],
                capo: 0,
                sourceURL: 'https://example.com',
                content: 'C G Am F...',
            });

            expect(api.post).toHaveBeenCalledWith('/tabs', {
                title: 'New Song',
                content: 'C G Am F...',
                capo: 0,
                source_url: 'https://example.com',
                artist_id: 1,
                tag_ids: [1],
            });

            expect(store.detailedTabs[3]).toBeDefined();
            expect(store.tabsList).toHaveLength(1);
            expect(store.tabsList[0].id).toBe(3);
        });

        it('should handle tab creation without optional fields', async () => {
            const store = useTabsStore();
            const mockData: ApiResponse<TabDto> = {
                content: {
                    id: 3,
                    title: 'New Song',
                    artist: null,
                    tags: [],
                    capo: 0,
                    source_url: '',
                    content: 'C G Am F...',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockData });

            await store.createTab({
                title: 'New Song',
                artist: null,
                tags: [],
                capo: 0,
                sourceURL: '',
                content: 'C G Am F...',
            });

            expect(api.post).toHaveBeenCalledWith('/tabs', {
                title: 'New Song',
                content: 'C G Am F...',
                capo: 0,
                source_url: '',
                tag_ids: [],
            });
        });
    });

    describe('updateTab', () => {
        it('should update a tab with changed fields only', async () => {
            const store = useTabsStore();

            // Set up initial tab
            store.detailedTabs['1'] = {
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [{ id: 1, name: 'rock' }],
                capo: 2,
                sourceURL: 'https://example.com',
                content: 'E A D...',
            };

            const mockData: ApiResponse<TabDto> = {
                content: {
                    id: 1,
                    title: 'Wonderwall (Updated)',
                    artist: { id: 1, name: 'Oasis' },
                    tags: [{ id: 1, name: 'rock' }],
                    capo: 3,
                    source_url: 'https://example.com',
                    content: 'E A D...',
                },
            };

            vi.mocked(api.put).mockResolvedValue({ data: mockData });

            await store.updateTab('1', { title: 'Wonderwall (Updated)', capo: 3 });

            expect(api.put).toHaveBeenCalledWith('/tabs/1', {
                title: 'Wonderwall (Updated)',
                capo: 3,
            });

            expect(store.detailedTabs['1'].title).toBe('Wonderwall (Updated)');
            expect(store.detailedTabs['1'].capo).toBe(3);
        });

        it('should not send request if nothing changed', async () => {
            const store = useTabsStore();

            store.detailedTabs['1'] = {
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [],
                capo: 2,
                sourceURL: 'https://example.com',
                content: 'E A D...',
            };

            await store.updateTab('1', { title: 'Wonderwall', capo: 2 });

            expect(api.put).not.toHaveBeenCalled();
        });

        it('should update tabsList when updating a tab', async () => {
            const store = useTabsStore();

            store.detailedTabs['1'] = {
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [],
                capo: 2,
                sourceURL: 'https://example.com',
                content: 'E A D...',
            };

            store.tabsList = [
                {
                    id: 1,
                    title: 'Wonderwall',
                    artist: { id: 1, name: 'Oasis' },
                    tags: [],
                },
            ];

            const mockData: ApiResponse<TabDto> = {
                content: {
                    id: 1,
                    title: 'Wonderwall (Updated)',
                    artist: { id: 2, name: 'Beatles' },
                    tags: [{ id: 1, name: 'rock' }],
                    capo: 2,
                    source_url: 'https://example.com',
                    content: 'E A D...',
                },
            };

            vi.mocked(api.put).mockResolvedValue({ data: mockData });

            await store.updateTab('1', {
                title: 'Wonderwall (Updated)',
                artist: { id: 2, name: 'Beatles' },
            });

            expect(store.tabsList[0].title).toBe('Wonderwall (Updated)');
            expect(store.tabsList[0].artist?.name).toBe('Beatles');
        });
    });

    describe('deleteTab', () => {
        it('should delete a tab from both caches', async () => {
            const store = useTabsStore();

            store.detailedTabs['1'] = {
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [],
                capo: 2,
                sourceURL: 'https://example.com',
                content: 'E A D...',
            };

            store.tabsList = [
                {
                    id: 1,
                    title: 'Wonderwall',
                    artist: { id: 1, name: 'Oasis' },
                    tags: [],
                },
                {
                    id: 2,
                    title: 'Hey Jude',
                    artist: { id: 2, name: 'Beatles' },
                    tags: [],
                },
            ];

            vi.mocked(api.delete).mockResolvedValue({
                data: { message: 'Tab deleted successfully' },
            });

            await store.deleteTab('1');

            expect(api.delete).toHaveBeenCalledWith('/tabs/1');
            expect(store.detailedTabs['1']).toBeUndefined();
            expect(store.tabsList).toHaveLength(1);
            expect(store.tabsList[0].id).toBe(2);
        });
    });
});
