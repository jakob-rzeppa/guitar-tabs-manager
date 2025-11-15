import api, { useApi } from '@/services/api';
import type { APIResponse } from '@/types/types';
import { ref, watch } from 'vue';

export const useTabTransposer = () => {
    const transposeLoading = ref<boolean>(false);
    const transposeError = ref<string | null>(null);
    const transposeResponse = ref<APIResponse<string> | null>(null);

    const transposedTabContent = ref<string | null>(null);

    watch(transposeResponse, (newValue) => {
        if (newValue && newValue.content) {
            transposedTabContent.value = newValue.content;
        } else {
            transposedTabContent.value = null;
        }
    });

    const transposeTab = (content: string, transposeDir: 'up' | 'down') => {
        useApi({
            loading: transposeLoading,
            error: transposeError,
            response: transposeResponse,
            apiCall: () => api.post('/tabs/transpose', { content, dir: transposeDir }),
        }).then(() => {
            if (transposeError.value) {
                return;
            }

            if (!transposeResponse.value || !transposeResponse.value.content) {
                transposeError.value = 'API Transpose Response not found.';
                return;
            }
        });
    };

    return {
        transposeLoading,
        transposeError,
        transposedTabContent,
        transposeTab,
    };
};
