<script setup lang="ts">

import {useRoute} from "vue-router";
import {computed, onMounted, ref, toRaw} from "vue";
import type {APIResponse, Tab} from "@/types/types.ts";
import ContentWrapper from "@/components/ContentWrapper.vue";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import SelectArtist from "@/components/SelectArtist.vue";
import SelectTags from "@/components/SelectTags.vue";
import {useTabByIdStore} from "@/stores/tabById.ts";
import api, {useApi} from "@/services/api.ts";

const route = useRoute()
const tabByIdStore = useTabByIdStore()

const tabId = computed(() => route.params.id as string)
const currentTab = computed(() => tabByIdStore.tabs[tabId.value])

const localTab = ref<Tab | null>(null)
function saveTab() {
  if (!localTab.value) {
    console.error("Tab not found")
    return
  }

  if (!currentTab.value.content) {
    console.error("Current tab not found");
    return
  }

  const title = currentTab.value.content.title !== localTab.value.title ? localTab.value.title : null
  const capo = currentTab.value.content.capo !== localTab.value.capo ? localTab.value.capo : null
  const content = currentTab.value.content.content !== localTab.value.content ? localTab.value.content : null

  const artistId = currentTab.value.content.artist?.id !== localTab.value.artist.id
      ? localTab.value.artist.id
      : null

  let tagIds: number[] | null = localTab.value.tags.map(tag => tag.id).sort((a, b) => a - b)
  const oldTagIds = currentTab.value.content.tags.map(tag => tag.id).sort((a, b) => a - b)

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
  tabByIdStore.updateTab(currentTab.value.content.id.toString(), dto)
}

onMounted(async () => {
  await tabByIdStore.fetchTab(tabId.value)
  localTab.value = structuredClone(toRaw(currentTab.value.content!))
})

// FORMAT
const formatLoading = ref<boolean>(false);
const formatError = ref<string | null>(null);
const formatResponse = ref<APIResponse<string> | null>(null)

function formatTab() {
  if (!localTab.value) {
    console.error("Tab not found for formating.")
    return
  }

  const prevTabContent = localTab.value.content;

  useApi({
    loading: formatLoading,
    error: formatError,
    response: formatResponse,
    apiCall: () => api.post('/tab/format', {content: prevTabContent})
  }).then(() => {
    if (!formatResponse.value || !formatResponse.value.content) {
      console.error("API Format Response not found.")
      return
    }
    if (!localTab.value) {
      console.error("Tab not found for formating.")
      return
    }
    localTab.value.content = formatResponse.value.content;
    console.log('Tab formated successfully.');
  })
}

// TRANSPOSE
const transposeDir = ref<'up' | 'down'>('down')
const transposeLoading = ref<boolean>(false);
const transposeError = ref<string | null>(null);
const transposeResponse = ref<APIResponse<string> | null>(null)
const transposeAndMoveCapo = ref(true)

function transposeTab() {
  if (!localTab.value) {
    console.error("Tab not found for transposing.")
    return
  }

  const prevTabContent = localTab.value.content;

  useApi({
    loading: transposeLoading,
    error: transposeError,
    response: transposeResponse,
    apiCall: () => api.post('/tab/transpose', {content: prevTabContent, dir: transposeDir.value})
  }).then(() => {
    if (!transposeResponse.value || !transposeResponse.value.content) {
      console.error("API Transpose Response not found.")
      return
    }
    if (!localTab.value) {
      console.error("Tab not found for transposing.")
      return
    }
    if (transposeAndMoveCapo.value === true) {
      if (transposeDir.value === 'up') {
        localTab.value.capo--
      } else if (transposeDir.value === 'down') {
        localTab.value.capo++
      } else {
        console.error("Something went wrong when changing the capo.")
        return
      }
    }
    localTab.value.content = transposeResponse.value.content;
    console.log('Tab transposed ' + (transposeAndMoveCapo.value === true && 'and capo changed ') + 'successfully.');
  })
}
</script>

<template>
  <ContentWrapper>
    <LoadingPlaceholder v-if="tabByIdStore.loading" />
    <ErrorDisplay v-else-if="tabByIdStore.error !== null" :message="tabByIdStore.error" />
    <ErrorDisplay v-else-if="!currentTab || !currentTab.content" message="No content." />
    <ErrorDisplay v-else-if="localTab === null" message="Something went wrong while retrieving tabs." />
    <div v-else class="p-10">
      <h1 class="text-4xl">Edit Tab</h1>
      <div class="flex flex-col gap-4 pt-4">
        <label class="input w-full">
          <span class="label">title</span>
          <input type="text" :value="localTab.title" @input="event => localTab!.title = (event.target as HTMLInputElement).value" />
        </label>
        <label class="input w-full">
          <span class="label">capo</span>
          <input type="number" :value="localTab.capo" @input="event => localTab!.capo = parseInt((event.target as HTMLInputElement).value)" />
        </label>
        <SelectArtist :artist="currentTab.content.artist" @select="artist => localTab!.artist = artist" />
        <SelectTags :initial-tags="currentTab.content.tags" @select="tags => localTab!.tags = tags" />
        <button class="btn btn-success w-fit" @click="saveTab">Save</button>
      </div>
      <div class="divider"></div>
      <LoadingPlaceholder v-if="formatLoading || transposeLoading" />
      <ErrorDisplay v-else-if="formatError !== null" :message="formatError" />
      <ErrorDisplay v-else-if="transposeError !== null" :message="transposeError" />
      <div v-else class="flex flex-col gap-4">
        <button class="btn w-fit" @click="formatTab">Format</button>
        <div class="flex gap-2">
          <select class="select w-max" v-model="transposeAndMoveCapo">
            <option :value="true">change Capo</option>
            <option :value="false">transpose</option>
          </select>
          <select class="select w-min" v-model="transposeDir">
            <option>up</option>
            <option>down</option>
          </select>
          <button class="btn w-fit" @click="transposeTab">{{ transposeAndMoveCapo ? 'Change Capo' : 'Transpose'}}</button>
        </div>
        <p class="text-info hidden">Dont forget to save changes.</p>
        <textarea class="textarea w-full h-screen" :value="localTab.content" @input="event => localTab!.content = (event.target as HTMLInputElement).value"></textarea>
      </div>
    </div>
  </ContentWrapper>
</template>