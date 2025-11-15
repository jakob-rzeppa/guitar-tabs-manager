<script setup lang="ts">
import { useRoute } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useTabsStore } from '@/stores/tabsStore';
import { computed, onMounted } from 'vue';

const route = useRoute();
const tabsStore = useTabsStore();

const tabId = computed(() => route.params.id as string);
const currentTab = computed(() => tabsStore.detailedTabs[tabId.value]);

onMounted(async () => {
    await tabsStore.fetchTab(tabId.value);
});
</script>

<template>
    <ContentWrapper>
        <LoadingPlaceholder v-if="tabsStore.loading" />
        <ErrorDisplay v-else-if="tabsStore.error" :message="tabsStore.error" />
        <ErrorDisplay v-else-if="!currentTab || !currentTab" message="No content." />
        <div v-else class="p-10">
            <h1 class="text-4xl">
                {{ currentTab.title }}
                <span v-if="currentTab.artist !== null" class="text-primary">by</span>
                <span v-if="currentTab.artist !== null">{{ currentTab.artist.name }}</span>
            </h1>
            <ul class="flex flex-row flex-wrap gap-1.5">
                <li v-for="tag in currentTab.tags" class="badge badge-secondary">
                    {{ tag.name }}
                </li>
            </ul>
            <p class="">Capo: {{ currentTab.capo }}</p>
            <RouterLink class="btn btn-primary" :to="`/tab/${tabId}/edit`">Edit</RouterLink>
            <div class="divider"></div>
            <pre class="text-sm">{{ currentTab.content }}</pre>
        </div>
    </ContentWrapper>
</template>
