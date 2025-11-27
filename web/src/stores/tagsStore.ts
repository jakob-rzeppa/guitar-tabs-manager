import type { Tag } from '@/types/types';
import { defineStore } from 'pinia';

interface State {
    tags: Tag[];
    loading: boolean;
    error: string | null;
}

export const useTagsStore = defineStore('tags', {
    state: (): State => ({
        tags: [],
        loading: false,
        error: null,
    })
});
