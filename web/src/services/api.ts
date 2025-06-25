import axios, { type AxiosResponse, type Method} from 'axios';
import {type Ref} from 'vue'
import type { APIResponse } from "@/types/types.ts";

const baseURL = import.meta.env.VITE_API_ENDPOINT

const axiosInstance = axios.create({
    baseURL,
});

console.log('Successfully created axios instance with the baseURL:', baseURL);

export async function fetchFromAPI<T>(route: string, method: Method, refs: {loading: Ref<boolean>, response: Ref<AxiosResponse<APIResponse<T>> | null>, error: Ref<string | null>}) {
    const {loading, response, error} = refs

    error.value = response.value = null
    loading.value = true

    try {
        response.value = await axiosInstance.request<APIResponse<T>>({
            url: route,
            method
        })
        console.log(response)
    } catch (err: unknown) {
        if (err instanceof Error) {
            error.value = err.toString()
        }
    } finally {
        loading.value = false
    }
}