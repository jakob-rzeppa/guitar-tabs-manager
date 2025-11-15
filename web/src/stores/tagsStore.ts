import api, { useApiInStore } from '@/services/api';
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
    }),
    actions: {
        /**
         * Fetch all tags
         * @param options.force - Force refetch even if data is already loaded
         */
        async fetchAllTags(options: { force?: boolean } = {}): Promise<void> {
            // Skip if already loaded unless force is true
            if (!options.force && this.tags.length > 0) return;

            await useApiInStore<Tag[]>({
                store: this,
                apiCall: () => api.get('/tags'),
                onSuccess: ({ data }) => {
                    if (!data.content) {
                        this.error = 'Request content is empty';
                        return;
                    }

                    this.tags = data.content;
                },
            });
        },
    },
});
