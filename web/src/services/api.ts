import axios, { AxiosError, type AxiosResponse } from 'axios';
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
        onSuccess(res);
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            console.log('API call failed:', err.response);

            const errorMessage = err.response?.data.message;
            error.value = `Request failed` + (err.response?.status ? ` with status code ${err.response?.status}` : '') + (errorMessage ? `: ${errorMessage}` : '');
        } else if (err instanceof Error) {
            error.value = err.message;
        } else {
            error.value = 'An unknown error occurred';
        }
    } finally {
        loading.value = false;
    }
}