import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useTagsStore } from '../tagsStore';
import type { ApiResponse, TagDto } from '@/types/dtos';
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

describe('tagsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    describe('state', () => {
        it('should have correct initial state', () => {
            const store = useTagsStore();

            expect(store.tags).toEqual([]);
            expect(store.loading).toBe(false);
            expect(store.error).toBeNull();
        });
    });

    describe('fetchAllTags', () => {
        it('should fetch all tags and update state', async () => {
            const store = useTagsStore();
            const mockData: ApiResponse<TagDto[]> = {
                content: [
                    { id: 1, name: 'rock' },
                    { id: 2, name: 'acoustic' },
                    { id: 3, name: 'classic' },
                ],
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchAllTags();

            expect(api.get).toHaveBeenCalledWith('/tags');
            expect(store.tags).toHaveLength(3);
            expect(store.tags[0]).toEqual({ id: 1, name: 'rock' });
            expect(store.tags[1]).toEqual({ id: 2, name: 'acoustic' });
            expect(store.tags[2]).toEqual({ id: 3, name: 'classic' });
            expect(store.error).toBeNull();
        });

        it('should not refetch if data already loaded unless force is true', async () => {
            const store = useTagsStore();
            const mockData: ApiResponse<TagDto[]> = {
                content: [
                    { id: 1, name: 'rock' },
                ],
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchAllTags();
            expect(api.get).toHaveBeenCalledTimes(1);
            expect(store.tags).toHaveLength(1);

            await store.fetchAllTags();
            expect(api.get).toHaveBeenCalledTimes(1); // Should not call again

            await store.fetchAllTags({ force: true });
            expect(api.get).toHaveBeenCalledTimes(2); // Should call when forced
        });

        it('should set error when content is empty', async () => {
            const store = useTagsStore();
            vi.mocked(api.get).mockResolvedValue({ data: {} });

            await store.fetchAllTags();

            expect(store.error).toBe('Request content is empty');
            expect(store.tags).toEqual([]);
        });

        it('should handle API errors', async () => {
            const store = useTagsStore();
            vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

            await expect(store.fetchAllTags()).rejects.toThrow('Network error');
            expect(store.error).toBe('Network error');
        });

        it('should handle empty tags array', async () => {
            const store = useTagsStore();
            const mockData: ApiResponse<TagDto[]> = {
                content: [],
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchAllTags();

            expect(store.tags).toEqual([]);
            expect(store.error).toBeNull();
        });

        it('should properly map tag DTOs to internal format', async () => {
            const store = useTagsStore();
            const mockData: ApiResponse<TagDto[]> = {
                content: [
                    { id: 99, name: 'progressive-rock' },
                ],
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockData });

            await store.fetchAllTags();

            expect(store.tags[0]).toEqual({
                id: 99,
                name: 'progressive-rock',
            });
        });
    });

    describe('loading state', () => {
        it('should set loading to true during fetch and false after', async () => {
            const store = useTagsStore();
            const mockData: ApiResponse<TagDto[]> = {
                content: [{ id: 1, name: 'rock' }],
            };

            let loadingDuringCall = false;
            vi.mocked(api.get).mockImplementation(async () => {
                loadingDuringCall = store.loading;
                return { data: mockData };
            });

            expect(store.loading).toBe(false);
            
            await store.fetchAllTags();
            
            expect(loadingDuringCall).toBe(true);
            expect(store.loading).toBe(false);
        });
    });
});
