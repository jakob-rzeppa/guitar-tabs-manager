<script setup lang="ts">

import {fetchFromAPI} from "@/services/api.ts";
import type {APIResponse, Artist} from "@/types/types.ts";
import {ref} from "vue";
import type {AxiosResponse} from "axios";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import ErrorDisplay from "@/components/ErrorDisplay.vue";

const loading = ref(false)
const response = ref<AxiosResponse<APIResponse<Artist[]>> | null>(null)
const error = ref<string | null>(null)

fetchFromAPI<Artist[]>('/artist', 'GET', {loading, response, error}).then();
</script>

<template>
  <LoadingPlaceholder v-if="loading" />
  <ErrorDisplay v-else-if="error" :message="error" />
  <ErrorDisplay v-else-if="!response || !response.data.content" message="Something went wrong while retrieving artists." />
  <label v-else class="input box-border w-full">
    <span class="label">Artist</span>
    <input list="artists" type="text" placeholder="Type here" />
    <datalist id="artists">
      <option v-for="artist in response.data.content" :value="artist.name" />
    </datalist>
  </label>
</template>