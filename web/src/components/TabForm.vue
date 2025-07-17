<script setup lang="ts">

import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import SelectArtist from "@/components/SelectArtist.vue";
import SelectTags from "@/components/SelectTags.vue";
import {onMounted, ref, toRaw} from "vue";
import type {APIResponse, Tab} from "@/types/types.ts";
import api, {useApi} from "@/services/api.ts";
import {useTabByIdStore} from "@/stores/tabById.ts";

interface Props {
  prevTab: Tab | null;
}

const {prevTab} = defineProps<Props>()

const emit = defineEmits(["done"])

const tabByIdStore = useTabByIdStore()

const localTab = ref<Tab | null>(null)

async function saveTab() {
  if (!localTab.value) {
    console.error("Tab not found")
    return
  }

  // If tab is created
  if (prevTab === null) {
    let tagIds: number[] | null = localTab.value.tags.map(tag => tag.id).sort((a, b) => a - b)

    const dto = Object.assign({},
        {title: localTab.value.title},
        {capo: localTab.value.capo},
        {content: localTab.value.content},
        {artist_id: localTab.value.artist.id},
        {tag_ids: tagIds},
    )

    console.log("Creating tab", dto)

    emit("done")

    await tabByIdStore.createTab(dto)

    return
  }

  const title = prevTab.title !== localTab.value.title ? localTab.value.title : null
  const capo = prevTab.capo !== localTab.value.capo ? localTab.value.capo : null
  const content = prevTab.content !== localTab.value.content ? localTab.value.content : null

  const artistId = prevTab.artist?.id !== localTab.value.artist.id
      ? localTab.value.artist.id
      : null

  let tagIds: number[] | null = localTab.value.tags.map(tag => tag.id).sort((a, b) => a - b)
  const oldTagIds = prevTab.tags.map(tag => tag.id).sort((a, b) => a - b)

  if (tagIds.length === oldTagIds.length && tagIds.every((val, i) => val === oldTagIds[i])) {
    tagIds = null
  }

  const dto = Object.assign({},
      title && {title},
      capo && {capo},
      content && {content},
      artistId && {artist_id: artistId},
      tagIds && {tag_ids: tagIds},
  )

  if (Object.keys(dto).length === 0) {
    console.log("No tab changes to save.")
    emit("done")
    return
  }

  console.log("Updating tab " + prevTab.id, dto)

  emit("done")

  await tabByIdStore.updateTab(prevTab.id.toString(), dto)
}

onMounted(() => {
  localTab.value = structuredClone(toRaw(prevTab))
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
    apiCall: () => api.post('/tabs/format', {content: prevTabContent})
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
    apiCall: () => api.post('/tabs/transpose', {content: prevTabContent, dir: transposeDir.value})
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

function discardChanges() {
  if (!localTab.value || !prevTab) {
    console.error("Tab not found when discarding changes.")
    emit('done')
    return
  }

  let tagIds: number[] | null = localTab.value.tags.map(tag => tag.id).sort((a, b) => a - b)
  const oldTagIds = prevTab.tags.map(tag => tag.id).sort((a, b) => a - b)

  if (
      prevTab.title !== localTab.value.title ||
      prevTab.capo !== localTab.value.capo ||
      prevTab.content !== localTab.value.content ||
      prevTab.artist?.id !== localTab.value.artist.id ||
      tagIds.length !== oldTagIds.length || tagIds.every((val, i) => val !== oldTagIds[i])
  ) {
    alert('Are you sure you want to discard all changes?')
  }

  emit('done')
}
</script>

<template>
  <LoadingPlaceholder v-if="tabByIdStore.loading"/>
  <ErrorDisplay v-else-if="tabByIdStore.error !== null" :message="tabByIdStore.error"/>
  <ErrorDisplay v-else-if="localTab === null" message="Something went wrong while retrieving tabs."/>
  <div v-else>
    <div class="flex flex-col gap-4 pt-4">
      <label class="input w-full">
        <span class="label">title</span>
        <input type="text" :value="localTab.title"
               @input="event => localTab!.title = (event.target as HTMLInputElement).value"/>
      </label>
      <label class="input w-full">
        <span class="label">capo</span>
        <input
            type="number"
            :value="localTab.capo"
            @input="event => localTab!.capo = parseInt((event.target as HTMLInputElement).value)"
        />
      </label>
      <SelectArtist :artist="prevTab !== null ? prevTab.artist : null" @select="artist => localTab!.artist = artist"/>
      <SelectTags :initial-tags="prevTab !== null ? prevTab.tags : []" @select="tags => localTab!.tags = tags"/>
      <div class="flex flex-row gap-4">
        <button class="btn btn-error w-fit" @click="discardChanges">Discard Changes</button>
        <button class="btn btn-success w-fit" @click="saveTab">Save</button>
      </div>
    </div>
    <div class="divider"></div>
    <LoadingPlaceholder v-if="formatLoading || transposeLoading"/>
    <ErrorDisplay v-else-if="formatError !== null" :message="formatError"/>
    <ErrorDisplay v-else-if="transposeError !== null" :message="transposeError"/>
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
        <button class="btn w-fit" @click="transposeTab">{{ transposeAndMoveCapo ? 'Change Capo' : 'Transpose' }}
        </button>
      </div>
      <p class="text-info hidden">Dont forget to save changes.</p>
      <textarea
          class="textarea w-full h-screen"
          :value="localTab.content"
          @input="event => localTab!.content = (event.target as HTMLInputElement).value"
      ></textarea>
    </div>
  </div>
</template>