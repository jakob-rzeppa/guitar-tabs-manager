import type { Artist } from '@/types/types';
import { defineStore } from 'pinia';

interface State {
    artists: Artist[];
    loading: boolean;
    error: string | null;
}

export const useArtistStore = defineStore('artist', {
    state: (): State => ({
        artists: [],
        loading: false,
        error: null,
    }),
});
