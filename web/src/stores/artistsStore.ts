import api, { useApiInStore } from '@/services/api';
import type { Artist } from '@/types/types';
import { defineStore } from 'pinia';

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

            await useApiInStore<Artist[]>({
                store: this,
                apiCall: () => api.get('/artists'),
                onSuccess: ({ data }) => {
                    if (!data.content) {
                        this.error = 'Request content is empty';
                        return;
                    }

                    this.artists = data.content;
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

                    this.artists.push(data.content);
                },
            });
        },
    },
});
