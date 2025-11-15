<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import SelectArtist from '@/components/SelectArtist.vue';
import SelectTags from '@/components/SelectTags.vue';
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
        <div class="p-10 max-w-4xl mx-auto">
            <h1 class="text-4xl mb-6">Edit Tab</h1>

            <LoadingPlaceholder v-if="tabsStore.loading" />
            <ErrorDisplay v-else-if="tabsStore.error !== null" :message="tabsStore.error" />
            <ErrorDisplay
                v-else-if="localTab === null"
                message="Something went wrong while loading the tab."
            />

            <div v-else @keypress.enter="handleSave" class="space-y-6">
                <!-- Title -->
                <div>
                    <label for="title" class="block text-sm font-medium mb-2">Title</label>
                    <input
                        id="title"
                        v-model="localTab.title"
                        type="text"
                        required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <!-- Artist -->
                <SelectArtist v-model="localTab.artist" />

                <!-- Tags -->
                <SelectTags v-model="localTab.tags" />

                <!-- Capo -->
                <div>
                    <label for="capo" class="block text-sm font-medium mb-2">Capo</label>
                    <input
                        id="capo"
                        v-model.number="localTab.capo"
                        type="number"
                        min="0"
                        max="12"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <!-- Content (Tab notation) -->
                <div>
                    <label for="content" class="block text-sm font-medium mb-2">Tab Content</label>
                    <textarea
                        @keypress.enter.stop=""
                        id="content"
                        v-model="localTab.content"
                        rows="20"
                        required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="Enter tab notation here..."
                    ></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button
                        @click="handleSave"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save
                    </button>
                    <button
                        @click="handleCancel"
                        class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
