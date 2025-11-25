import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSheetsStore } from '../sheetsStore';
import type { ApiResponse, SheetDto, SheetListItemDto } from '@/types/dtos';
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

describe('sheetsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    describe('state', () => {
        it('should have correct initial state', () => {
            const store = useSheetsStore();

            expect(store.detailedSheets).toEqual({});
            expect(store.sheetsList).toEqual([]);
            expect(store.loading).toBe(false);
            expect(store.error).toBeNull();
        });
    });

    describe('fetchAllSheets', () => {
        it('should fetch all sheets and update sheetsList', async () => {
            const store = useSheetsStore();
            const mockData: ApiResponse<SheetListItemDto[]> = {
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

            await store.fetchAllSheets();

            expect(api.get).toHaveBeenCalledWith('/sheets');
            expect(store.sheetsList).toHaveLength(2);
            expect(store.sheetsList[0]).toEqual({
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [{ id: 1, name: 'rock' }],
            });
            expect(store.error).toBeNull();
        });

        it('should not refetch if data already loaded unless force is true', async () => {
            const store = useSheetsStore();
            const mockData: ApiResponse<SheetListItemDto[]> = {
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

            await store.fetchAllSheets();
            expect(api.get).toHaveBeenCalledTimes(1);

            await store.fetchAllSheets();
            expect(api.get).toHaveBeenCalledTimes(1); // Should not call again

            await store.fetchAllSheets({ force: true });
            expect(api.get).toHaveBeenCalledTimes(2); // Should call when forced
        });

        it('should set error when content is empty', async () => {
            const store = useSheetsStore();
            vi.mocked(api.get).mockResolvedValue({ data: {} });

            await store.fetchAllSheets();

            expect(store.error).toBe('Request content is empty');
        });

        it('should handle API errors', async () => {
            const store = useSheetsStore();
            vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

            await expect(store.fetchAllSheets()).rejects.toThrow('Network error');
            expect(store.error).toBe('Network error');
        });
    });

    describe('fetchSheet', () => {
        it('should fetch a single sheet with full details', async () => {
            const store = useSheetsStore();
            const mockData: ApiResponse<SheetDto> = {
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

            await store.fetchSheet('1');

            expect(api.get).toHaveBeenCalledWith('/sheets/1');
            expect(store.detailedSheets['1']).toEqual({
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

        it('should not refetch if sheet already cached unless force is true', async () => {
            const store = useSheetsStore();
            const mockData: ApiResponse<SheetDto> = {
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

            await store.fetchSheet('1');
            expect(api.get).toHaveBeenCalledTimes(1);

            await store.fetchSheet('1');
            expect(api.get).toHaveBeenCalledTimes(1); // Should not call again

            await store.fetchSheet('1', { force: true });
            expect(api.get).toHaveBeenCalledTimes(2); // Should call when forced
        });

        it('should set error when content is empty', async () => {
            const store = useSheetsStore();
            vi.mocked(api.get).mockResolvedValue({ data: {} });

            await store.fetchSheet('1');

            expect(store.error).toBe('Request content is empty');
        });
    });

    describe('createSheet', () => {
        it('should create a new sheet and add to both caches', async () => {
            const store = useSheetsStore();
            const mockData: ApiResponse<SheetDto> = {
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

            await store.createSheet({
                title: 'New Song',
                artist: { id: 1, name: 'Oasis' },
                tags: [{ id: 1, name: 'rock' }],
                capo: 0,
                sourceURL: 'https://example.com',
                content: 'C G Am F...',
            });

            expect(api.post).toHaveBeenCalledWith('/sheets', {
                title: 'New Song',
                content: 'C G Am F...',
                capo: 0,
                source_url: 'https://example.com',
                artist_id: 1,
                tag_ids: [1],
            });

            expect(store.detailedSheets[3]).toBeDefined();
            expect(store.sheetsList).toHaveLength(1);
            expect(store.sheetsList[0].id).toBe(3);
        });

        it('should handle sheet creation without optional fields', async () => {
            const store = useSheetsStore();
            const mockData: ApiResponse<SheetDto> = {
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

            await store.createSheet({
                title: 'New Song',
                artist: null,
                tags: [],
                capo: 0,
                sourceURL: '',
                content: 'C G Am F...',
            });

            expect(api.post).toHaveBeenCalledWith('/sheets', {
                title: 'New Song',
                content: 'C G Am F...',
                capo: 0,
                source_url: '',
                tag_ids: [],
            });
        });
    });

    describe('updateSheet', () => {
        it('should update a sheet with changed fields only', async () => {
            const store = useSheetsStore();

            // Set up initial sheet
            store.detailedSheets['1'] = {
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [{ id: 1, name: 'rock' }],
                capo: 2,
                sourceURL: 'https://example.com',
                content: 'E A D...',
            };

            const mockData: ApiResponse<SheetDto> = {
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

            await store.updateSheet('1', { title: 'Wonderwall (Updated)', capo: 3 });

            expect(api.put).toHaveBeenCalledWith('/sheets/1', {
                title: 'Wonderwall (Updated)',
                capo: 3,
            });

            expect(store.detailedSheets['1'].title).toBe('Wonderwall (Updated)');
            expect(store.detailedSheets['1'].capo).toBe(3);
        });

        it('should not send request if nothing changed', async () => {
            const store = useSheetsStore();

            store.detailedSheets['1'] = {
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [],
                capo: 2,
                sourceURL: 'https://example.com',
                content: 'E A D...',
            };

            await store.updateSheet('1', { title: 'Wonderwall', capo: 2 });

            expect(api.put).not.toHaveBeenCalled();
        });

        it('should update sheetsList when updating a sheet', async () => {
            const store = useSheetsStore();

            store.detailedSheets['1'] = {
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [],
                capo: 2,
                sourceURL: 'https://example.com',
                content: 'E A D...',
            };

            store.sheetsList = [
                {
                    id: 1,
                    title: 'Wonderwall',
                    artist: { id: 1, name: 'Oasis' },
                    tags: [],
                },
            ];

            const mockData: ApiResponse<SheetDto> = {
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

            await store.updateSheet('1', {
                title: 'Wonderwall (Updated)',
                artist: { id: 2, name: 'Beatles' },
            });

            expect(store.sheetsList[0].title).toBe('Wonderwall (Updated)');
            expect(store.sheetsList[0].artist?.name).toBe('Beatles');
        });
    });

    describe('deleteSheet', () => {
        it('should delete a sheet from both caches', async () => {
            const store = useSheetsStore();

            store.detailedSheets['1'] = {
                id: 1,
                title: 'Wonderwall',
                artist: { id: 1, name: 'Oasis' },
                tags: [],
                capo: 2,
                sourceURL: 'https://example.com',
                content: 'E A D...',
            };

            store.sheetsList = [
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
                data: { message: 'Sheet deleted successfully' },
            });

            await store.deleteSheet('1');

            expect(api.delete).toHaveBeenCalledWith('/sheets/1');
            expect(store.detailedSheets['1']).toBeUndefined();
            expect(store.sheetsList).toHaveLength(1);
            expect(store.sheetsList[0].id).toBe(2);
        });
    });
});
