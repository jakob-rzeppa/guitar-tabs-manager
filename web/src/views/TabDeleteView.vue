<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackButton from '@/components/BackButton.vue';
import PageHeader from '@/components/PageHeader.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';
import XIcon from '@/components/icons/XIcon.vue';
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
                        <DeleteIcon class="h-8 w-8 text-error-content" />
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
                    <WarningIcon />
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
                        <DeleteIcon />
                        Delete Tab
                    </button>
                    <button
                        type="button"
                        @click="handleCancel"
                        class="btn btn-outline btn-lg gap-2"
                    >
                        <XIcon />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
