<script setup lang="ts">
import {ref} from "vue";
import type {AxiosResponse} from "axios";
import type {APIResponse, Tab} from "@/types/types.ts";
import {fetchFromAPI} from "@/services/api.ts";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import {useRouter} from "vue-router";
import ContentWrapper from "@/components/ContentWrapper.vue";
import TabsDisplay from "@/components/TabsDisplay.vue";

const router = useRouter()

const loading = ref(false)
const response = ref<AxiosResponse<APIResponse<Tab[]>> | null>(null)
const error = ref<string | null>(null)

fetchFromAPI<Tab[]>('/tab', 'GET', {loading, response, error}).then();
</script>

<template>
  <ContentWrapper>
    <ErrorDisplay v-if="error !== null" :message="error" />
    <LoadingPlaceholder v-else-if="loading" />
    <ErrorDisplay v-else-if="response === null || response.data.content === undefined" :message="'Data is not available.'" />
    <TabsDisplay v-else :tabs="response.data.content" />
  </ContentWrapper>
</template>