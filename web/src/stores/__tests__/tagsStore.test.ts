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
                content: [{ id: 1, name: 'rock' }],
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
                content: [{ id: 99, name: 'progressive-rock' }],
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

    describe('createTag', () => {
        it('should create a new tag and add to state', async () => {
            const store = useTagsStore();
            const mockData: ApiResponse<TagDto> = {
                content: { id: 4, name: 'jazz' },
                message: 'Tag created successfully',
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockData });

            await store.createTag({ name: 'jazz' });

            expect(api.post).toHaveBeenCalledWith('/tags', { name: 'jazz' });
            expect(store.tags).toHaveLength(1);
            expect(store.tags[0]).toEqual({ id: 4, name: 'jazz' });
            expect(store.error).toBeNull();
        });

        it('should set error when content is empty', async () => {
            const store = useTagsStore();
            vi.mocked(api.post).mockResolvedValue({ data: {} });

            await store.createTag({ name: 'jazz' });

            expect(store.error).toBe('Request content is empty');
        });

        it('should handle API errors', async () => {
            const store = useTagsStore();
            vi.mocked(api.post).mockRejectedValue(new Error('Creation failed'));

            await expect(store.createTag({ name: 'jazz' })).rejects.toThrow('Creation failed');
            expect(store.error).toBe('Creation failed');
        });
    });

    describe('updateTag', () => {
        it('should update a tag and refresh state', async () => {
            const store = useTagsStore();
            store.tags = [
                { id: 1, name: 'rock' },
                { id: 2, name: 'acoustic' },
            ];

            const mockData: ApiResponse<TagDto> = {
                content: { id: 1, name: 'pop' },
                message: 'Tag updated successfully',
            };

            vi.mocked(api.put).mockResolvedValue({ data: mockData });

            await store.updateTag(1, { name: 'pop' });

            expect(api.put).toHaveBeenCalledWith('/tags/1', { name: 'pop' });
            expect(store.tags[0].name).toBe('pop');
            expect(store.error).toBeNull();
        });

        it('should set error when content is empty', async () => {
            const store = useTagsStore();
            store.tags = [{ id: 1, name: 'rock' }];

            vi.mocked(api.put).mockResolvedValue({ data: {} });

            await store.updateTag(1, { name: 'updated' });

            expect(store.error).toBe('Response content is empty');
        });

        it('should handle tag not found in local state', async () => {
            const store = useTagsStore();
            store.tags = [{ id: 2, name: 'acoustic' }];

            const mockData: ApiResponse<TagDto> = {
                content: { id: 1, name: 'pop' },
            };

            vi.mocked(api.put).mockResolvedValue({ data: mockData });

            await store.updateTag(1, { name: 'pop' });

            // Tag not found, so state remains unchanged
            expect(store.tags).toHaveLength(1);
            expect(store.tags[0].id).toBe(2);
        });

        it('should handle API errors', async () => {
            const store = useTagsStore();
            store.tags = [{ id: 1, name: 'rock' }];

            vi.mocked(api.put).mockRejectedValue(new Error('Update failed'));

            await expect(store.updateTag(1, { name: 'updated' })).rejects.toThrow('Update failed');
            expect(store.error).toBe('Update failed');
        });
    });

    describe('deleteTag', () => {
        it('should delete a tag from state', async () => {
            const store = useTagsStore();
            store.tags = [
                { id: 1, name: 'rock' },
                { id: 2, name: 'acoustic' },
                { id: 3, name: 'classic' },
            ];

            vi.mocked(api.delete).mockResolvedValue({
                data: { message: 'Tag deleted successfully' },
            });

            await store.deleteTag(2);

            expect(api.delete).toHaveBeenCalledWith('/tags/2');
            expect(store.tags).toHaveLength(2);
            expect(store.tags[0].id).toBe(1);
            expect(store.tags[1].id).toBe(3);
        });

        it('should handle deleting non-existent tag', async () => {
            const store = useTagsStore();
            store.tags = [
                { id: 1, name: 'rock' },
                { id: 2, name: 'acoustic' },
            ];

            vi.mocked(api.delete).mockResolvedValue({
                data: { message: 'Tag deleted successfully' },
            });

            await store.deleteTag(99);

            expect(api.delete).toHaveBeenCalledWith('/tags/99');
            // State remains unchanged since tag wasn't there
            expect(store.tags).toHaveLength(2);
        });

        it('should handle API errors', async () => {
            const store = useTagsStore();
            store.tags = [{ id: 1, name: 'rock' }];

            vi.mocked(api.delete).mockRejectedValue(new Error('Deletion failed'));

            await expect(store.deleteTag(1)).rejects.toThrow('Deletion failed');
            expect(store.error).toBe('Deletion failed');
        });
    });
});
