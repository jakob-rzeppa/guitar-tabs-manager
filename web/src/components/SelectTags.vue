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
const errorMessage = ref<string | null>(null)

function addActiveTag(event: Event) {
  const inputElement = event.currentTarget as HTMLInputElement

  if (inputElement.value === '') {
    displayError('Please enter a tag')
    return
  }

  if (!response || !response.value || !response.value.data.content) {
    displayError('Something went wrong. Please try reloading the page.');
    return
  }

  const tagToAdd = response.value.data.content.find(
      (tag) => tag.name.toLowerCase() === inputElement.value.toLowerCase()
  )

  if (!tagToAdd) {
    displayError('No tag found with this name')
    return
  }

  if (activeTags.value.includes(tagToAdd)) {
    displayError('Tag already selected')
    return
  }

  activeTags.value.push(tagToAdd)

  inputElement.value = ''
  removeError()
}

function removeActiveTag(event: Event) {
  const element = event.currentTarget as HTMLInputElement

  if (!response || !response.value || !response.value.data.content) {
    throw new Error("Response object is empty.")
  }

  const indexToRemove = activeTags.value.findIndex((tag) => tag.id === parseInt(element.value))

  if (!indexToRemove) {
    displayError('Something went wrong.');
    return
  }

  activeTags.value.splice(indexToRemove, 1)

  removeError()
}

function displayError(message: string) {
  errorMessage.value = message
}

function removeError() {
  errorMessage.value = null
}
</script>

<template>
  <LoadingPlaceholder v-if="loading" />
  <ErrorDisplay v-else-if="error" :message="error" />
  <ErrorDisplay v-else-if="!response || !response.data.content" message="Something went wrong while retrieving artists." />
  <div v-else class="">
    <label class="input box-border w-full" :class="{ 'input-error': errorMessage }">
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
    <div class="mt-1 text-error" :class="{ 'hidden': !errorMessage }">{{errorMessage}}</div>
  </div>
</template>