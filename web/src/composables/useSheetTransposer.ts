import api, { useApi } from '@/services/api';
import type { ApiResponse, TransposeSheetDto } from '@/types/dtos';
import { ref, watch } from 'vue';

export const useSheetTransposer = () => {
    const transposeLoading = ref<boolean>(false);
    const transposeError = ref<string | null>(null);
    const transposeResponse = ref<ApiResponse<TransposeSheetDto> | null>(null);

    const transposedSheetContent = ref<string | null>(null);

    watch(transposeResponse, (newValue) => {
        if (newValue && newValue.content) {
            transposedSheetContent.value = newValue.content.content;
        } else {
            transposedSheetContent.value = null;
        }
    });

    const transposeSheet = (content: string, transposeDir: 'up' | 'down') => {
        useApi<TransposeSheetDto>({
            loading: transposeLoading,
            error: transposeError,
            response: transposeResponse,
            apiCall: () => api.post('/sheets/transpose', { content, dir: transposeDir }),
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
        transposedSheetContent,
        transposeSheet,
    };
};
