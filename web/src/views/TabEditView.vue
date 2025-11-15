<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import SelectArtist from '@/components/SelectArtist.vue';
import SelectTags from '@/components/SelectTags.vue';
import BackButton from '@/components/BackButton.vue';
import PageHeader from '@/components/PageHeader.vue';
import SaveCancelButtons from '@/components/SaveCancelButtons.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useTabsStore } from '@/stores/tabsStore';
import type { Tab } from '@/types/types';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

const tabId = computed(() => route.params.id as string);

const localTab = ref<Tab | null>(null);

watch(
    () => tabsStore.detailedTabs[tabId.value],
    (newTab) => {
        if (newTab) {
            // If we directly assign newTab to localTab, changes to localTab would affect the store's state.
            localTab.value = JSON.parse(JSON.stringify(newTab));
        }
    },
    { immediate: true, deep: true },
);

onMounted(() => {
    tabsStore.fetchTab(tabId.value);
});

const handleSave = async () => {
    if (!localTab.value) return;

    // Exclude the id field from the update payload
    const { id, ...fieldsToUpdate } = localTab.value;
    await tabsStore.updateTab(tabId.value, fieldsToUpdate);

    if (!tabsStore.error) {
        router.push({ name: 'tab', params: { id: tabId.value } });
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
                <PageHeader title="Edit Tab" icon-color="primary">
                    <template #icon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 text-primary-content"
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
                    </template>
                </PageHeader>
            </div>

            <LoadingPlaceholder v-if="tabsStore.loading" />
            <ErrorDisplay v-else-if="tabsStore.error !== null" :message="tabsStore.error" />
            <ErrorDisplay
                v-else-if="localTab === null"
                message="Something went wrong while loading the tab."
            />

            <div v-else @keypress.enter="handleSave" class="space-y-6">
                <!-- Title -->
                <div>
                    <label class="label" for="title">
                        <span class="label-text text-base font-semibold">Title</span>
                    </label>
                    <input
                        id="title"
                        v-model="localTab.title"
                        type="text"
                        required
                        placeholder="Enter tab title"
                        class="input input-bordered input-lg w-full"
                    />
                </div>

                <!-- Artist -->
                <SelectArtist v-model="localTab.artist" />

                <!-- Tags -->
                <SelectTags v-model="localTab.tags" />

                <!-- Capo -->
                <div>
                    <label class="label" for="capo">
                        <span class="label-text text-base font-semibold">Capo</span>
                        <span class="label-text-alt">Fret position (0-12)</span>
                    </label>
                    <input
                        id="capo"
                        v-model.number="localTab.capo"
                        type="number"
                        min="0"
                        max="12"
                        class="input input-bordered input-lg w-full"
                    />
                </div>

                <!-- Content (Tab notation) -->
                <div>
                    <label class="label" for="content">
                        <span class="label-text text-base font-semibold">Tab Content</span>
                        <span class="label-text-alt">Tab notation goes here</span>
                    </label>
                    <textarea
                        @keypress.enter.stop=""
                        id="content"
                        v-model="localTab.content"
                        rows="20"
                        required
                        class="textarea textarea-bordered w-full font-mono text-sm h-96"
                        placeholder="Enter tab notation here..."
                    ></textarea>
                </div>

                <!-- Action Buttons -->
                <SaveCancelButtons :on-save="handleSave" :on-cancel="handleCancel" class="pt-4" />
            </div>
        </div>
    </ContentWrapper>
</template>
