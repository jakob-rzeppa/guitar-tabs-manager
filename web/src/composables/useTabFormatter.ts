import api, { useApi } from '@/services/api';
import type { APIResponse } from '@/types/types';
import { ref, watch } from 'vue';

export const useTabFormatter = () => {
    const formatLoading = ref<boolean>(false);
    const formatError = ref<string | null>(null);
    const formatResponse = ref<APIResponse<string> | null>(null);

    const formattedTabContent = ref<string | null>(null);

    watch(formatResponse, (newValue) => {
        if (newValue && newValue.content) {
            formattedTabContent.value = newValue.content;
        } else {
            formattedTabContent.value = null;
        }
    });

    function formatTab(content: string) {
        useApi({
            loading: formatLoading,
            error: formatError,
            response: formatResponse,
            apiCall: () => api.post('/tabs/format', { content }),
        }).then(() => {
            if (!formatResponse.value || !formatResponse.value.content) {
                formatError.value = 'API Format Response not found.';
                return;
            }
        });
    }

    return {
        formatLoading,
        formatError,
        formattedTabContent,
        formatTab,
    };
};
