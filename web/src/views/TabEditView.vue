<script setup lang="ts">

import ContentWrapper from "@/components/ContentWrapper.vue";
import TabForm from "@/components/TabForm.vue";
import {computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useTabByIdStore} from "@/stores/tabById.ts";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import ErrorDisplay from "@/components/ErrorDisplay.vue";

const route = useRoute()
const router = useRouter()
const tabByIdStore = useTabByIdStore()

const tabId = computed(() => route.params.id as string)
const fetchedTab = computed(() => tabByIdStore.tabs[tabId.value])

onMounted(() => {
  tabByIdStore.fetchTab(tabId.value)
})
</script>

<template>
  <ContentWrapper>
    <div class="p-10">
      <h1 class="text-4xl">Edit Tab</h1>
      <LoadingPlaceholder v-if="tabByIdStore.loading"/>
      <ErrorDisplay v-else-if="tabByIdStore.error !== null" :message="tabByIdStore.error"/>
      <TabForm
          v-else
          :prev-tab="fetchedTab.content ? fetchedTab.content : null"
          @done="() => router.push({ name: 'tab', params: { id: tabId }})"
      />
    </div>
  </ContentWrapper>
</template>