<script setup lang="ts">
import {ref} from "vue";
import type {AxiosResponse} from "axios";
import type {APIResponse, Tab} from "@/types/types.ts";
import {fetchFromAPI} from "@/services/api.ts";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import ContentWrapper from "@/components/ContentWrapper.vue";
import TabsDisplay from "@/components/TabsDisplay.vue";
import calculateSimilarity from "@/services/calculateSimilarity.ts";
import SelectArtist from "@/components/SelectArtist.vue";

const loading = ref(false)
const response = ref<AxiosResponse<APIResponse<Tab[]>> | null>(null)
const error = ref<string | null>(null)

fetchFromAPI<Tab[]>('/tab', 'GET', {loading, response, error}).then();

function orderTabs(event: Event) {
  const searchValue = (event.target as HTMLInputElement).value
  if (!response.value || !response.value.data.content) {
    return;
  }

  response.value.data.content.sort((a, b) => {
    const titleA = a.title.toLowerCase()
    const titleB = b.title.toLowerCase()
    return (
        calculateSimilarity(searchValue, titleB) -
        calculateSimilarity(searchValue, titleA)
    )
  })
}

function filterByArtist(event: Event) {
  const searchValue = (event.target as HTMLInputElement).value
  if (!response.value || !response.value.data.content) {
    return;
  }

  response.value.data.content.filter((item) => item.artist.name.toLowerCase() === searchValue);
}
</script>

<template>
  <ContentWrapper>
    <div class="px-14 pt-8">
      <h1 class="text-4xl font-bold mx-auto w-fit mb-8">Search for Tabs</h1>
      <label class="input box-border w-full">
        <span class="label font-bold">Search</span>
        <input type="text" placeholder="Type here" @input="orderTabs" />
      </label>
      <div tabindex="0" class="collapse collapse-arrow">
        <input type="checkbox" />
        <div class="collapse-title font-semibold">Filter</div>
        <div class="collapse-content flex flex-col gap-4">
          <SelectArtist />
          <label class="input box-border w-full">
            <span class="label">Tags</span>
            <input type="text" placeholder="Type here" />
          </label>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <ErrorDisplay v-if="error !== null" :message="error" />
    <LoadingPlaceholder v-else-if="loading" />
    <ErrorDisplay v-else-if="!response || !response.data.content" :message="'Data is not available.'" />
    <TabsDisplay v-else :tabs="response.data.content" />
  </ContentWrapper>
</template>