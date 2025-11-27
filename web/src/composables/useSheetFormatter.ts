import api, { useApi } from '@/services/api';
import type { ApiResponse, FormatSheetDto } from '@/types/dtos';
import { ref, watch } from 'vue';

export const useSheetFormatter = () => {
    const formatLoading = ref<boolean>(false);
    const formatError = ref<string | null>(null);
    const formatResponse = ref<ApiResponse<FormatSheetDto> | null>(null);

    const formattedSheetContent = ref<string | null>(null);

    watch(formatResponse, (newValue) => {
        if (newValue && newValue.payload) {
            formattedSheetContent.value = newValue.payload.content;
        } else {
            formattedSheetContent.value = null;
        }
    });

    function formatSheet(content: string) {
        useApi<FormatSheetDto>({
            loading: formatLoading,
            error: formatError,
            response: formatResponse,
            apiCall: () => api.post('/sheets/format', { content }),
        }).then(() => {
            if (!formatResponse.value || !formatResponse.value.payload) {
                formatError.value = 'API Format Response not found.';
                return;
            }
        });
    }

    return {
        formatLoading,
        formatError,
        formattedSheetContent,
        formatSheet,
    };
};
