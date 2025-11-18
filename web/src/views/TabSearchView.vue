<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Artist, TabListItem, Tag } from '@/types/types.ts';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import TabsDisplay from '@/components/TabsDisplay.vue';
import calculateSimilarity from '@/services/calculateSimilarity.ts';
import SelectArtist from '@/components/SelectArtist.vue';
import SelectTags from '@/components/SelectTags.vue';
import { useTabsStore } from '@/stores/tabsStore';
import BaseSearchView from '@/views/BaseSearchView.vue';

const tabsStore = useTabsStore();

tabsStore.fetchAllTabs();

const searchValue = ref<string>('');
const artistFilter = ref<Artist | null>(null);
const tagsFilter = ref<Tag[]>([]);
const displayedTabs = ref<TabListItem[]>([]);

watch(
    () => [tabsStore.tabsList, searchValue.value, artistFilter.value, tagsFilter.value],
    () => {
        if (artistFilter.value === null) {
            displayedTabs.value = [...tabsStore.tabsList];
        } else {
            displayedTabs.value = tabsStore.tabsList.filter((tab) => {
                return (
                    !artistFilter.value ||
                    (tab.artist !== null && tab.artist.id === artistFilter.value.id)
                );
            });
        }

        if (tagsFilter.value.length > 0) {
            displayedTabs.value = displayedTabs.value.filter((item) => {
                if (item.tags.length === 0) {
                    return false;
                }

                const itemTagIds = item.tags.map((tag) => tag.id);
                return tagsFilter.value.every((filterTag) => itemTagIds.includes(filterTag.id));
            });
        }

        displayedTabs.value.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            return (
                calculateSimilarity(searchValue.value, titleB) -
                calculateSimilarity(searchValue.value, titleA)
            );
        });
    },
    { immediate: true, deep: true },
);
</script>

<template>
    <BaseSearchView :create-route="{ name: 'tabCreate' }">
        <template #title>Search for Tabs</template>
        <template #search-input>
            <input placeholder="Search by title..." v-model="searchValue" />
        </template>
        <template #filters>
            <SelectArtist v-model="artistFilter" />
            <SelectTags v-model="tagsFilter" />
        </template>
        <template #content>
            <LoadingPlaceholder v-if="tabsStore.loading" />
            <ErrorDisplay v-else-if="tabsStore.error !== null" :message="tabsStore.error" />
            <div v-else-if="displayedTabs.length === 0" class="text-center py-16">
                <p class="text-xl opacity-60">No tabs found. Try adjusting your filters.</p>
            </div>
            <TabsDisplay v-else :tabs="displayedTabs" />
        </template>
    </BaseSearchView>
</template>
