import axios, { type AxiosResponse } from 'axios';
import type { APIResponse } from '@/types/types.ts';
import type { Ref } from 'vue';

const baseURL = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance = axios.create({
    baseURL,
});

console.log('Successfully created axios instance with the baseURL:', baseURL);

export default axiosInstance;

interface UseApiParams<T> {
    loading: Ref<boolean>;
    error: Ref<string | null>;
    response: Ref<APIResponse<T> | null>;
    apiCall: () => Promise<AxiosResponse<APIResponse<T>>>;
}

export async function useApi<T>({
    loading,
    error,
    response,
    apiCall,
}: UseApiParams<T>): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
        response.value = (await apiCall()).data;
        return;
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

interface UseApiInStoreParams<T> {
    store: { loading: boolean; error: string | null };
    apiCall: () => Promise<AxiosResponse<APIResponse<T>>>;
    onSuccess?: (response: AxiosResponse<APIResponse<T>>) => void;
}

export async function useApiInStore<T>({
    store,
    apiCall,
    onSuccess,
}: UseApiInStoreParams<T>): Promise<APIResponse<T>> {
    store.loading = true;
    store.error = null;

    try {
        const response = await apiCall();
        onSuccess?.(response);
        return response.data;
    } catch (err: unknown) {
        if (err instanceof Error) {
            store.error = err.message || 'Request failed';
        } else {
            store.error = 'An unknown error occurred';
        }
        throw err;
    } finally {
        store.loading = false;
    }
}
