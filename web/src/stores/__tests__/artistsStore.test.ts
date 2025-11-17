import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useArtistsStore } from '../artistsStore';
import type { ApiResponse, ArtistDto } from '@/types/dtos';
import * as apiModule from '@/services/api';

// Mock the tabs store
vi.mock('../tabsStore', () => ({
    useTabsStore: vi.fn(() => ({
        tabsList: [],
        detailedTabs: {},
    })),
}));

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

describe('artistsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    describe('state', () => {
        it('should have correct initial state', () => {
            const store = useArtistsStore();

            expect(store.artists).toEqual([]);
            expect(store.loading).toBe(false);
            expect(store.error).toBeNull();
        });
    });

    describe('fetchAllArtists', () => {
        it('should fetch all artists and update state', async () => {
            const store = useArtistsStore();
            const mockData: ApiResponse<ArtistDto[]> = {
                content: [
                    { id: 1, name: 'Oasis' },
                    { id: 2, name: 'The Beatles' },
                ],
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchAllArtists();

            expect(api.get).toHaveBeenCalledWith('/artists');
            expect(store.artists).toHaveLength(2);
            expect(store.artists[0]).toEqual({ id: 1, name: 'Oasis' });
            expect(store.artists[1]).toEqual({ id: 2, name: 'The Beatles' });
            expect(store.error).toBeNull();
        });

        it('should not refetch if data already loaded unless force is true', async () => {
            const store = useArtistsStore();
            const mockData: ApiResponse<ArtistDto[]> = {
                content: [{ id: 1, name: 'Oasis' }],
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchAllArtists();
            expect(api.get).toHaveBeenCalledTimes(1);

            await store.fetchAllArtists();
            expect(api.get).toHaveBeenCalledTimes(1); // Should not call again

            await store.fetchAllArtists({ force: true });
            expect(api.get).toHaveBeenCalledTimes(2); // Should call when forced
        });

        it('should set error when content is empty', async () => {
            const store = useArtistsStore();
            vi.mocked(api.get).mockResolvedValue({ data: {} });

            await store.fetchAllArtists();

            expect(store.error).toBe('Request content is empty');
        });

        it('should handle API errors', async () => {
            const store = useArtistsStore();
            vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

            await expect(store.fetchAllArtists()).rejects.toThrow('Network error');
            expect(store.error).toBe('Network error');
        });
    });

    describe('createArtist', () => {
        it('should create a new artist and add to state', async () => {
            const store = useArtistsStore();
            const mockData: ApiResponse<ArtistDto> = {
                content: { id: 3, name: 'New Artist' },
                message: 'Artist created successfully',
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockData });

            await store.createArtist({ name: 'New Artist' });

            expect(api.post).toHaveBeenCalledWith('/artists', { name: 'New Artist' });
            expect(store.artists).toHaveLength(1);
            expect(store.artists[0]).toEqual({ id: 3, name: 'New Artist' });
            expect(store.error).toBeNull();
        });

        it('should set error when content is empty', async () => {
            const store = useArtistsStore();
            vi.mocked(api.post).mockResolvedValue({ data: {} });

            await store.createArtist({ name: 'New Artist' });

            expect(store.error).toBe('Request content is empty');
        });

        it('should handle API errors', async () => {
            const store = useArtistsStore();
            vi.mocked(api.post).mockRejectedValue(new Error('Creation failed'));

            await expect(store.createArtist({ name: 'New Artist' })).rejects.toThrow(
                'Creation failed',
            );
            expect(store.error).toBe('Creation failed');
        });
    });

    describe('updateArtist', () => {
        it('should update an artist and refresh state', async () => {
            const store = useArtistsStore();
            store.artists = [
                { id: 1, name: 'Oasis' },
                { id: 2, name: 'The Beatles' },
            ];

            const mockData: ApiResponse<ArtistDto> = {
                content: { id: 1, name: 'Oasis (Updated)' },
                message: 'Artist updated successfully',
            };

            vi.mocked(api.put).mockResolvedValue({ data: mockData });

            await store.updateArtist(1, { name: 'Oasis (Updated)' });

            expect(api.put).toHaveBeenCalledWith('/artists/1', { name: 'Oasis (Updated)' });
            expect(store.artists[0].name).toBe('Oasis (Updated)');
            expect(store.error).toBeNull();
        });

        it('should update artist reference in tabs', async () => {
            const { useTabsStore } = await import('../tabsStore');
            const mockTabsStore = {
                tabsList: [
                    {
                        id: 1,
                        title: 'Wonderwall',
                        artist: { id: 1, name: 'Oasis' },
                        tags: [],
                    },
                ],
                detailedTabs: {
                    '1': {
                        id: 1,
                        title: 'Wonderwall',
                        artist: { id: 1, name: 'Oasis' },
                        tags: [],
                        capo: 2,
                        sourceURL: '',
                        content: 'E A D...',
                    },
                },
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            vi.mocked(useTabsStore).mockReturnValue(mockTabsStore as any);

            const artistStore = useArtistsStore();

            artistStore.artists = [{ id: 1, name: 'Oasis' }];

            const mockData: ApiResponse<ArtistDto> = {
                content: { id: 1, name: 'Oasis (Updated)' },
            };

            vi.mocked(api.put).mockResolvedValue({ data: mockData });

            await artistStore.updateArtist(1, { name: 'Oasis (Updated)' });

            expect(mockTabsStore.tabsList[0].artist?.name).toBe('Oasis (Updated)');
            expect(mockTabsStore.detailedTabs['1'].artist?.name).toBe('Oasis (Updated)');
        });

        it('should set error when content is empty', async () => {
            const store = useArtistsStore();
            store.artists = [{ id: 1, name: 'Oasis' }];

            vi.mocked(api.put).mockResolvedValue({ data: {} });

            await store.updateArtist(1, { name: 'Updated' });

            expect(store.error).toBe('Response content is empty');
        });
    });

    describe('deleteArtist', () => {
        it('should delete an artist from state', async () => {
            const store = useArtistsStore();
            store.artists = [
                { id: 1, name: 'Oasis' },
                { id: 2, name: 'The Beatles' },
            ];

            vi.mocked(api.delete).mockResolvedValue({
                data: { message: 'Artist deleted successfully' },
            });

            await store.deleteArtist(1);

            expect(api.delete).toHaveBeenCalledWith('/artists/1');
            expect(store.artists).toHaveLength(1);
            expect(store.artists[0].id).toBe(2);
        });

        it('should clear artist reference in tabs', async () => {
            const { useTabsStore } = await import('../tabsStore');
            const mockTabsStore = {
                tabsList: [
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
                ],
                detailedTabs: {
                    '1': {
                        id: 1,
                        title: 'Wonderwall',
                        artist: { id: 1, name: 'Oasis' },
                        tags: [],
                        capo: 2,
                        sourceURL: '',
                        content: 'E A D...',
                    },
                },
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            vi.mocked(useTabsStore).mockReturnValue(mockTabsStore as any);

            const artistStore = useArtistsStore();

            artistStore.artists = [{ id: 1, name: 'Oasis' }];

            vi.mocked(api.delete).mockResolvedValue({
                data: { message: 'Artist deleted successfully' },
            });

            await artistStore.deleteArtist(1);

            expect(mockTabsStore.tabsList[0].artist).toBeNull();
            expect(mockTabsStore.tabsList[1].artist?.id).toBe(2); // Other artist unchanged
            expect(mockTabsStore.detailedTabs['1'].artist).toBeNull();
        });

        it('should handle API errors', async () => {
            const store = useArtistsStore();
            store.artists = [{ id: 1, name: 'Oasis' }];

            vi.mocked(api.delete).mockRejectedValue(new Error('Deletion failed'));

            await expect(store.deleteArtist(1)).rejects.toThrow('Deletion failed');
            expect(store.error).toBe('Deletion failed');
        });
    });
});
