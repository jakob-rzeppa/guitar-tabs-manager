<script setup lang="ts">

import {useRoute} from "vue-router";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LoadingPlaceholder from "@/components/LoadingPlaceholder.vue";
import ContentWrapper from "@/components/ContentWrapper.vue";
import {useTabByIdStore} from "@/stores/tabById.ts";
import {computed, onMounted} from "vue";

const route = useRoute()
const tabByIdStore = useTabByIdStore()

const tabId = computed(() => route.params.id as string)
const currentTab = computed(() => tabByIdStore.tabs[tabId.value])

onMounted(async () => {
  await tabByIdStore.fetchTab(tabId.value)
})
</script>

<template>
  <ContentWrapper>
    <LoadingPlaceholder v-if="tabByIdStore.loading" />
    <ErrorDisplay v-else-if="tabByIdStore.error" :message="tabByIdStore.error" />
    <ErrorDisplay v-else-if="!currentTab || !currentTab.content" message="No content." />
    <div v-else class="p-10">
      <h1 class="text-4xl">{{currentTab.content.title}} <span v-if="currentTab.content.artist !== null" class="text-primary">by</span> <span v-if="currentTab.content.artist !== null">{{currentTab.content.artist.name}}</span></h1>
      <ul class="flex flex-row flex-wrap gap-1.5">
        <li v-for="tag in currentTab.content.tags" class="badge badge-secondary">
          {{tag.name}}
        </li>
      </ul>
      <p class="">Capo: {{currentTab.content.capo}}</p>
      <RouterLink class="btn btn-primary" :to="`/tab/${tabId}/edit`">Edit</RouterLink>
      <div class="divider"></div>
      <pre class="text-sm">{{currentTab.content.content}}</pre>
    </div>
  </ContentWrapper>
</template>
