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
        <div v-else class="p-6 md:p-10">
            <!-- Header Section -->
            <div class="mb-8">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    {{ currentTab.title }}
                </h1>
                <p v-if="currentTab.artist !== null" class="text-xl text-base-content/70 mb-4">
                    <span class="text-primary font-semibold">by</span> {{ currentTab.artist.name }}
                </p>

                <!-- Tags -->
                <div class="flex flex-row flex-wrap gap-2 mb-4">
                    <div
                        v-for="tag in currentTab.tags"
                        class="badge badge-secondary badge-lg gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                        </svg>
                        {{ tag.name }}
                    </div>
                </div>

                <!-- Capo Info -->
                <div class="alert alert-info shadow-md w-fit">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span
                        ><strong>Capo:</strong>
                        {{ currentTab.capo === 0 ? 'None' : `Fret ${currentTab.capo}` }}</span
                    >
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 mb-6">
                <RouterLink class="btn btn-outline btn-secondary gap-2" :to="`/tabSearch`">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to Search
                </RouterLink>
                <RouterLink class="btn btn-primary gap-2" :to="`/tab/${tabId}/edit`">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    Edit
                </RouterLink>
                <RouterLink class="btn btn-primary gap-2" :to="`/tab/${tabId}/transpose`">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                    </svg>
                    Transpose
                </RouterLink>
                <RouterLink class="btn btn-primary gap-2" :to="`/tab/${tabId}/format`">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                    Format
                </RouterLink>
            </div>

            <div class="divider"></div>

            <!-- Tab Content -->
            <div class="card bg-base-200 shadow-xl">
                <div class="card-body">
                    <pre class="text-sm overflow-x-auto whitespace-pre-wrap">{{
                        currentTab.content
                    }}</pre>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
