import axios, { type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/dtos.ts';
import { type Ref } from 'vue';

const baseURL = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance = axios.create({
    baseURL,
});

console.log('Successfully created axios instance with the baseURL:', baseURL);

export default axiosInstance;

interface UseApiParams<T> {
    loadingRef: Ref<boolean>;
    errorRef: Ref<string | null>;
    onSuccess: (response: AxiosResponse<ApiResponse<T>>) => void;
    apiCall: () => Promise<AxiosResponse<ApiResponse<T>>>;
}

export async function callApi<T>({
    loadingRef: loading,
    errorRef: error,
    onSuccess,
    apiCall,
}: UseApiParams<T>): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
        const res = await apiCall();

        console.log('API call successful:', res);
        if (res.status >= 200 && res.status < 300) {
            onSuccess(res);
            return;
        }

        const errMessage = res.data?.message;
        error.value = "Request failed" + (errMessage ? `: ${errMessage}` : '');
    } catch (err: unknown) {
        if (err instanceof Error) {
            error.value = err.message || 'Request failed';
        } else {
            error.value = 'An unknown error occurred';
        }
        throw err;
    } finally {
        loading.value = false;
    }
}