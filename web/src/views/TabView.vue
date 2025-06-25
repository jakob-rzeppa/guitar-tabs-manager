<script setup lang="ts">

import {useRoute} from "vue-router";
import type {APIResponse, Tab} from "@/types/types.ts";
import {ref, watch} from "vue";
import type {AxiosResponse} from "axios";
import {fetchFromAPI} from "@/services/api.ts";

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

      fetchFromAPI('/tab/' + id, 'GET', {loading, response, error}).then();
    }, { immediate: true }
)

</script>

<template>
  <main>
    TabView: {{ response?.data }}
  </main>
</template>
