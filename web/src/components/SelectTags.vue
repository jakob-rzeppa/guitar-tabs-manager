<script setup lang="ts">

import {ref} from "vue";
import type {AxiosResponse} from "axios";
import type {APIResponse, Tag} from "@/types/types.ts";
import {fetchFromAPI} from "@/services/api.ts";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";

const loading = ref(false)
const response = ref<AxiosResponse<APIResponse<Tag[]>> | null>(null)
const error = ref<string | null>(null)

fetchFromAPI<Tag[]>('/tag', 'GET', {loading, response, error}).then();

const activeTags = ref<Tag[]>([])

function addActiveTag(event: Event) {
  const inputElement = event.currentTarget as HTMLInputElement

  if (inputElement.value === '') {
    //TODO display error
    return
  }

  if (!response || !response.value || !response.value.data.content) {
    //TODO display error
    return
  }

  const tagToAdd = response.value.data.content.find(
      (tag) => tag.name.toLowerCase() === inputElement.value.toLowerCase()
  )

  if (!tagToAdd) {
    //TODO display error
    return
  }

  if (activeTags.value.includes(tagToAdd)) {
    //TODO display error
    return
  }

  activeTags.value.push(tagToAdd)

  inputElement.value = ''
}

function removeActiveTag(event: Event) {
  const element = event.currentTarget as HTMLInputElement

  if (!response || !response.value || !response.value.data.content) {
    //TODO display error
    return
  }

  const indexToRemove = activeTags.value.findIndex((tag) => tag.id === parseInt(element.value))

  if (!indexToRemove) {
    //TODO display error
    return
  }

  activeTags.value.splice(indexToRemove, 1)

  console.log(activeTags.value)
}
</script>

<template>
  <LoadingPlaceholder v-if="loading" />
  <ErrorDisplay v-else-if="error" :message="error" />
  <ErrorDisplay v-else-if="!response || !response.data.content" message="Something went wrong while retrieving artists." />
  <div v-else class="">
    <label class="input box-border w-full">
      <span class="label">Tags</span>
      <span v-if="activeTags.length > 0" class="label">
        <span v-for="tag in activeTags" class="tooltip" data-tip="deselect">
          <span class="bg-primary px-3 py-1 rounded-lg group hover:brightness-80 cursor-pointer" @click="removeActiveTag" :id="tag.id.toString()">
            {{tag.name}}
          </span>
        </span>
      </span>
      <input type="text" list="tags" placeholder="Type here" @keyup.enter="addActiveTag" />
      <datalist id="tags">
        <option v-for="tag in response.data.content.filter( (el) => !activeTags.includes( el ))" :value="tag.name" />
      </datalist>
    </label>
  </div>
</template>