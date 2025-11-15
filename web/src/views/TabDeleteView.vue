<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackButton from '@/components/BackButton.vue';
import PageHeader from '@/components/PageHeader.vue';
import { computed, onMounted } from 'vue';
import { useTabsStore } from '@/stores/tabsStore';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

const tabId = computed(() => route.params.id as string);
const currentTab = computed(() => tabsStore.detailedTabs[tabId.value]);

onMounted(() => {
    tabsStore.fetchTab(tabId.value);
});

const handleDelete = async () => {
    await tabsStore.deleteTab(tabId.value);

    if (!tabsStore.error) {
        router.push({ name: 'tabSearch' });
    }
};

const handleCancel = () => {
    router.push({ name: 'tab', params: { id: tabId.value } });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-6 md:p-10 max-w-4xl mx-auto">
            <div class="mb-8">
                <BackButton :on-click="handleCancel" class="mb-4" />
                <PageHeader title="Delete Tab" icon-color="error">
                    <template #icon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 text-error-content"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </template>
                </PageHeader>
            </div>

            <LoadingPlaceholder v-if="tabsStore.loading" />
            <ErrorDisplay v-else-if="tabsStore.error" :message="tabsStore.error" />
            <ErrorDisplay
                v-else-if="!currentTab"
                message="Something went wrong while loading the tab."
            />

            <div v-else class="space-y-6">
                <div class="alert alert-warning shadow-lg">
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <div>
                        <h3 class="font-bold">Warning!</h3>
                        <div class="text-sm">
                            This action cannot be undone. This will permanently delete the tab.
                        </div>
                    </div>
                </div>

                <div class="card bg-base-200 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title text-2xl mb-2">{{ currentTab.title }}</h2>
                        <p v-if="currentTab.artist" class="text-base-content/70 mb-2">
                            <span class="text-primary font-semibold">by</span>
                            {{ currentTab.artist.name }}
                        </p>

                        <div class="flex flex-wrap gap-2 mb-4">
                            <div
                                v-for="tag in currentTab.tags"
                                :key="tag.id"
                                class="badge badge-secondary"
                            >
                                {{ tag.name }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button @click="handleDelete" class="btn btn-error btn-lg gap-2">
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                        Delete Tab
                    </button>
                    <button
                        type="button"
                        @click="handleCancel"
                        class="btn btn-outline btn-lg gap-2"
                    >
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
