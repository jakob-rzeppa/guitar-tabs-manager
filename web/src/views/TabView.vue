<script setup lang="ts">

import {useRoute} from "vue-router";
import type {APIResponse, Tab} from "@/types/types.ts";
import {ref, watch} from "vue";
import type {AxiosResponse} from "axios";
import {fetchFromAPI} from "@/services/api.ts";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import ContentWrapper from "@/components/ContentWrapper.vue";

const route = useRoute()

const loading = ref(false)
const response = ref<AxiosResponse<APIResponse<Tab>> | null>(null)
const error = ref<string | null>(null)

watch(
    () => route.params.id,
    (newId) => {
      let id = newId;
      if (Array.isArray(id)) {
        id = id[0];
      }

      fetchFromAPI<Tab>('/tab/' + id, 'GET', null, {loading, response, error}).then();
    }, { immediate: true }
)

</script>

<template>
  <ContentWrapper>
    <ErrorDisplay v-if="error !== null" :message="error" />
    <LoadingPlaceholder v-else-if="loading" />
    <ErrorDisplay v-else-if="response === null || response.data.content === undefined" :message="'Data is not available.'" />
    <div v-else class="p-10">
      <h1 class="text-4xl">{{response.data.content.title}} <span v-if="response.data.content.artist !== null" class="text-primary">by</span> <span v-if="response.data.content.artist !== null">{{response.data.content.artist.name}}</span></h1>
      <ul class="flex flex-row flex-wrap gap-1.5">
        <li v-for="tag in response.data.content.tags" class="badge badge-secondary">
          {{tag.name}}
        </li>
      </ul>
      <p class="">Capo: {{response.data.content.capo}}</p>
      <div class="divider"></div>
      <pre class="text-sm">{{response.data.content.content}}</pre>
    </div>
  </ContentWrapper>
</template>
