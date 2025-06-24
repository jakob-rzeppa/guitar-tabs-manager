import axios, { type AxiosResponse, type Method} from 'axios';
import { ref } from 'vue'
import type { APIResponse } from "@/types/types.ts";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VUE_API_ENDPOINT,
});

export function fetchDataFromAPI<T>(route: string, method: Method) {
    const loading = ref(false)
    const response = ref<AxiosResponse<APIResponse<T>> | null>(null)
    const error = ref<string | null>(null)

    const executeFetch = async () => {
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

    executeFetch().then()

    return {loading, response, error}
}