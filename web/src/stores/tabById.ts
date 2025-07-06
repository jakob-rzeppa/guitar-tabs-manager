import { defineStore } from 'pinia'
import api, { useApiInStore } from "@/services/api.ts";
import type { APIResponse, Tab } from "@/types/types.ts";

interface TabState {
  tabs: Record<string, APIResponse<Tab>>
  loading: boolean
  error: string | null
}

export const useTabByIdStore = defineStore('tabById', {
  state: (): TabState => ({
    tabs: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchTab(id: string, options: { force?: boolean } = {}): Promise<void> {
      if (!options.force && this.tabs[id]) return

      await useApiInStore<Tab>({
        store: this,
        apiCall: () => api.get(`/tab/${id}`),
        onSuccess: ({ data }) => {
          this.tabs[id] = data
        }
      })
    },

    async createTab(payload: Omit<Tab, 'id'>): Promise<void> {
      await useApiInStore<Tab>({
        store: this,
        apiCall: () => api.post('/tab', payload),
        onSuccess: ({ data }) => {
          if (!data.content) {
            this.error = 'Request content is empty'
            return
          }
          this.tabs[data.content.id] = data
        }
      })
    },

    async updateTab(id: string, payload: Partial<Tab>): Promise<void> {
      await useApiInStore<Tab>({
        store: this,
        apiCall: () => api.put(`/tab/${id}`, payload),
        onSuccess: ({ data }) => {
          this.tabs[id] = data
        }
      })
    },

    async deleteTab(id: string): Promise<void> {
      await useApiInStore<void>({
        store: this,
        apiCall: () => api.delete(`/tab/${id}`),
        onSuccess: () => {
          delete this.tabs[id]
        }
      })
    }
  }
})
