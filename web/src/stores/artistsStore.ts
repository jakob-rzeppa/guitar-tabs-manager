import api, { useApiInStore } from '@/services/api';
import type { Artist } from '@/types/types';
import { defineStore } from 'pinia';
import { useSheetsStore } from './sheetsStore';
import type { ArtistDto } from '@/types/dtos';

interface State {
    artists: Artist[];
    loading: boolean;
    error: string | null;
}

export const useArtistsStore = defineStore('artists', {
    state: (): State => ({
        artists: [],
        loading: false,
        error: null,
    }),
    actions: {
        /**
         * Fetch all artists
         * @param options.force - Force refetch even if data is already loaded
         */
        async fetchAllArtists(options: { force?: boolean } = {}): Promise<void> {
            // Skip if already loaded unless force is true
            if (!options.force && this.artists.length > 0) return;

            await useApiInStore<ArtistDto[]>({
                store: this,
                apiCall: () => api.get('/artists'),
                onSuccess: ({ data }) => {
                    if (!data.content) {
                        this.error = 'Request content is empty';
                        return;
                    }

                    this.artists = data.content.map((artistDto) => ({
                        id: artistDto.id,
                        name: artistDto.name,
                    }));
                },
            });
        },

        async createArtist(artist: Partial<Artist>): Promise<void> {
            await useApiInStore<Artist>({
                store: this,
                apiCall: () => api.post('/artists', artist),
                onSuccess: ({ data }) => {
                    if (!data.content) {
                        this.error = 'Request content is empty';
                        return;
                    }

                    this.artists.push({
                        id: data.content.id,
                        name: data.content.name,
                    });
                },
            });
        },

        async updateArtist(artistId: number, artist: Partial<Omit<Artist, 'id'>>): Promise<void> {
            const payload = { name: artist.name };

            await useApiInStore<ArtistDto>({
                store: this,
                apiCall: () => api.put(`/artists/${artistId}`, payload),
                onSuccess: ({ data }) => {
                    if (!data.content) {
                        this.error = 'Response content is empty';
                        return;
                    }

                    const index = this.artists.findIndex((a) => a.id === artistId);
                    if (index !== -1) {
                        this.artists[index] = data.content;
                    }

                    // Update artist name in sheets list
                    const sheetsStore = useSheetsStore();
                    sheetsStore.sheetsList.forEach((sheet) => {
                        if (sheet.artist && sheet.artist.id === artistId) {
                            sheet.artist = this.artists[index];
                        }
                    });

                    // Update artist name in detailed sheets
                    Object.values(sheetsStore.detailedSheets).forEach((sheet) => {
                        if (sheet.artist && sheet.artist.id === artistId) {
                            sheet.artist = this.artists[index];
                        }
                    });
                },
            });
        },

        async deleteArtist(artistId: number): Promise<void> {
            await useApiInStore<void>({
                store: this,
                apiCall: () => api.delete(`/artists/${artistId}`),
                onSuccess: () => {
                    this.artists = this.artists.filter((a) => a.id !== artistId);

                    // Clear artist reference in sheets list
                    const sheetsStore = useSheetsStore();
                    sheetsStore.sheetsList.forEach((sheet) => {
                        if (sheet.artist && sheet.artist.id === artistId) {
                            sheet.artist = null;
                        }
                    });

                    // Clear artist reference in detailed sheets
                    Object.keys(sheetsStore.detailedSheets).forEach((key) => {
                        const sheet = sheetsStore.detailedSheets[key];
                        if (sheet.artist && sheet.artist.id === artistId) {
                            sheetsStore.detailedSheets[key].artist = null;
                        }
                    });
                },
            });
        },
    },
});
