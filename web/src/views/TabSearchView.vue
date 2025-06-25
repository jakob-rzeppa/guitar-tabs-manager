<script setup lang="ts">
import {ref} from "vue";
import type {AxiosResponse} from "axios";
import type {APIResponse, Tab} from "@/types/types.ts";
import {fetchFromAPI} from "@/services/api.ts";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import {useRouter} from "vue-router";
import ContentWrapper from "@/components/ContentWrapper.vue";

const router = useRouter()

const loading = ref(false)
const response = ref<AxiosResponse<APIResponse<Tab[]>> | null>(null)
const error = ref<string | null>(null)

fetchFromAPI<Tab[]>('/tab', 'GET', {loading, response, error}).then();
</script>

<template>
  <ErrorDisplay v-if="error !== null" :message="error" />
  <LoadingPlaceholder v-else-if="loading" />
  <ErrorDisplay v-else-if="response === null || response.data.content === undefined" :message="'Data is not available.'" />
  <ContentWrapper v-else>
    <ul class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 p-8">
      <li v-for="tab in response.data.content" class="card shadow-sm bg-base-200 cursor-pointer hover:shadow-lg transition-shadow" @click="router.push({name: 'tab', params: {id: tab.id}});">
        <div class="card-body">
          <h2 class="card-title">{{tab.title}} <span v-if="tab.artist !== null" class="text-primary">by</span> <span v-if="tab.artist !== null">{{tab.artist.name}}</span></h2>
          <ul class="flex flex-row flex-wrap gap-1.5">
            <li v-for="tag in tab.tags" class="badge badge-secondary">
              {{tag.name}}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </ContentWrapper>
</template>