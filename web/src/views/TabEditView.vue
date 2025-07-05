<script setup lang="ts">

import {useRoute} from "vue-router";
import {ref, toRaw, watch} from "vue";
import type {AxiosResponse} from "axios";
import type {APIResponse, Tab} from "@/types/types.ts";
import {fetchFromAPI} from "@/services/api.ts";
import ContentWrapper from "@/components/ContentWrapper.vue";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import SelectArtist from "@/components/SelectArtist.vue";
import SelectTags from "@/components/SelectTags.vue";

const route = useRoute()

const loading = ref(false)
const response = ref<AxiosResponse<APIResponse<Tab>> | null>(null)
const error = ref<string | null>(null)

const tab = ref<Tab | null>(null)

watch(
  () => route.params.id,
  (newId) => {
    let id = newId;
    if (Array.isArray(id)) {
      id = id[0];
    }

    fetchFromAPI<Tab>('/tab/' + id, 'GET', null, {loading, response, error}).then(() => {
      if (!response.value || !response.value.data || !response.value.data.content) {
        console.error("API Response not found");
        return
      }
      tab.value = structuredClone(toRaw(response.value.data.content))
    });
  }, { immediate: true }
)

function saveTab() {
  if (!tab.value) {
    console.error("Tab not found");
    return
  }
  if (!response.value || !response.value.data || !response.value.data.content) {
    console.error("API Response not found");
    return
  }

  const title = response.value.data.content.title !== tab.value.title ? tab.value.title : null
  const capo = response.value.data.content.capo !== tab.value.capo ? tab.value.capo : null
  const content = response.value.data.content.content !== tab.value.content ? tab.value.content : null

  const artistId = response.value.data.content.artist?.id !== tab.value.artist.id
      ? tab.value.artist.id
      : null

  let tagIds: number[] | null = tab.value.tags.map(tag => tag.id).sort((a, b) => a - b)
  const oldTagIds = response.value.data.content.tags.map(tag => tag.id).sort((a, b) => a - b)

  if (tagIds.length === oldTagIds.length && tagIds.every((val, i) => val === oldTagIds[i])) {
    tagIds = null;
  }


  const dto = Object.assign({},
      title && {title},
      capo && {capo},
      content && {content},
      artistId && {artist_id: artistId},
      tagIds && {tag_ids: tagIds},
  );

  if (Object.keys(dto).length === 0) {
    console.log("No tab changes to save.")
    return
  }

  console.log("Saving tab changes: ", dto)
  fetchFromAPI<Tab>('/tab/' + route.params.id, 'PUT', dto, {loading, response, error}).then(() => {
    if (!response.value || !response.value.data || !response.value.data.content) {
      console.error("API Response not found");
      return
    }
    tab.value = structuredClone(toRaw(response.value.data.content))
  })
}
</script>

<template>
  <ContentWrapper>
    <ErrorDisplay v-if="error !== null" :message="error" />
    <LoadingPlaceholder v-else-if="loading" />
    <ErrorDisplay v-else-if="response === null || response.data.content === undefined" message="Data is not available." />
    <ErrorDisplay v-else-if="tab === null" message="Something went wrong while retrieving tabs." />
    <div v-else class="p-10">
      <h1 class="text-4xl">Edit Tab</h1>
      <div class="flex flex-col gap-4 pt-4">
        <label class="input w-full">
          <span class="label">title</span>
          <input type="text" :value="tab.title" @input="event => tab!.title = (event.target as HTMLInputElement).value" />
        </label>
        <label class="input w-full">
          <span class="label">capo</span>
          <input type="number" :value="tab.capo" @input="event => tab!.capo = parseInt((event.target as HTMLInputElement).value)" />
        </label>
        <SelectArtist :artist="response.data.content.artist" @select="artist => tab!.artist = artist" />
        <SelectTags :initial-tags="response.data.content.tags" @select="tags => tab!.tags = tags" />
        <button class="btn btn-success w-fit" @click="saveTab">Save</button>
      </div>
      <div class="divider"></div>
      <textarea class="textarea w-full" :value="tab.content" @input="event => tab!.content = (event.target as HTMLInputElement).value"></textarea>
    </div>
  </ContentWrapper>
</template>