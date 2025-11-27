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
});
