<script setup lang="ts">
import {ref, toRaw} from "vue";
import type {AxiosResponse} from "axios";
import type {APIResponse, Artist, Tab, Tag} from "@/types/types.ts";
import {fetchFromAPI} from "@/services/api.ts";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import ContentWrapper from "@/components/ContentWrapper.vue";
import TabsDisplay from "@/components/TabsDisplay.vue";
import calculateSimilarity from "@/services/calculateSimilarity.ts";
import SelectArtist from "@/components/SelectArtist.vue";
import SelectTags from "@/components/SelectTags.vue";

const loading = ref(false)
const response = ref<AxiosResponse<APIResponse<Tab[]>> | null>(null)
const error = ref<string | null>(null)

const displayedTabs = ref<Tab[]>([])

fetchFromAPI<Tab[]>('/tab', 'GET', {loading, response, error}).then(() => {
  if (!response.value || !response.value.data.content) {
    throw new Error("Response object is empty.")
  }
  displayedTabs.value = structuredClone(toRaw(response.value.data.content))
});

function orderTabs(event: Event) {
  const searchValue = (event.target as HTMLInputElement).value

  if (!response.value || !response.value.data.content) {
    throw new Error("Response object is empty.")
  }

  displayedTabs.value.sort((a, b) => {
    const titleA = a.title.toLowerCase()
    const titleB = b.title.toLowerCase()
    return (
        calculateSimilarity(searchValue, titleB) -
        calculateSimilarity(searchValue, titleA)
    )
  })

  // needs to be sorted as well, so that the right order is present when the artist or tabs are changed
  response.value.data.content.sort((a, b) => {
    const titleA = a.title.toLowerCase()
    const titleB = b.title.toLowerCase()
    return (
        calculateSimilarity(searchValue, titleB) -
        calculateSimilarity(searchValue, titleA)
    )
  })
}

function filterByArtist(artist: Artist | null) {
  if (!response.value || !response.value.data.content) {
    throw new Error("Response object is empty.")
  }

  if (!artist) {
    displayedTabs.value = response.value.data.content
    return
  }

  displayedTabs.value = response.value.data.content.filter((item) => {
    if (item.artist === null) {
      return false
    }
    return item.artist.id === artist.id
  })
}

function filterByTags(tags: Tag[]) {
  if (!response.value || !response.value.data.content) {
    throw new Error("Response object is empty.")
  }

  if (tags.length === 0) {
    displayedTabs.value = response.value.data.content
    return
  }

  displayedTabs.value = response.value.data.content.filter((item) => {
    if (item.tags.length === 0) {
      return false
    }

    const itemTagIds = item.tags.map(tag => tag.id)
    return tags.every(filterTag => itemTagIds.includes(filterTag.id))
  })
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
          <SelectArtist :artist="null" @select="filterByArtist" />
          <SelectTags :initial-tags="[]" @select="filterByTags" />
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <ErrorDisplay v-if="error !== null" :message="error" />
    <LoadingPlaceholder v-else-if="loading" />
    <TabsDisplay v-else :tabs="displayedTabs" />
  </ContentWrapper>
</template>