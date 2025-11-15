<script setup lang="ts">
import { ref, toRaw, watch } from 'vue';
import type { APIResponse, Artist, Tab, TabListItem, Tag } from '@/types/types.ts';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import TabsDisplay from '@/components/TabsDisplay.vue';
import calculateSimilarity from '@/services/calculateSimilarity.ts';
import SelectArtist from '@/components/SelectArtist.vue';
import SelectTags from '@/components/SelectTags.vue';
import { useTabsStore } from '@/stores/tabsStore';

const tabsStore = useTabsStore();

tabsStore.fetchAllTabs();

const searchValue = ref<string>('');
const artistIdFilter = ref<number | null>(null);
const tagIdsFilter = ref<number[]>([]);

const displayedTabs = ref<TabListItem[]>([]);

watch(
    () => [tabsStore.tabsList, searchValue.value, artistIdFilter.value, tagIdsFilter.value],
    () => {
        if (artistIdFilter.value === null) {
            displayedTabs.value = [...tabsStore.tabsList];
        } else {
            displayedTabs.value = tabsStore.tabsList.filter((tab) => {
                return tab.artist !== null && tab.artist.id === artistIdFilter.value;
            });
        }

        if (tagIdsFilter.value.length > 0) {
            displayedTabs.value = displayedTabs.value.filter((item) => {
                if (item.tags.length === 0) {
                    return false;
                }

                const itemTagIds = item.tags.map((tag) => tag.id);
                return tagIdsFilter.value.every((filterTagId) => itemTagIds.includes(filterTagId));
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
    { immediate: true },
);

function filterByArtist(artist: Artist | null) {
    artistIdFilter.value = artist?.id ?? null;
}

function filterByTags(tags: Tag[]) {
    tagIdsFilter.value = tags.map((tag) => tag.id);
}
</script>

<template>
    <ContentWrapper>
        <div class="px-14 pt-8">
            <h1 class="text-4xl font-bold mx-auto w-fit mb-8">Search for Tabs</h1>
            <label class="input box-border w-full">
                <span class="label font-bold">Search</span>
                <input type="text" placeholder="Type here" v-model="searchValue" />
            </label>
            <div tabindex="0" class="collapse collapse-arrow">
                <input type="checkbox" />
                <div class="collapse-title font-semibold">Filter</div>
                <div class="collapse-content flex flex-col gap-4">
                    <SelectArtist v-model="artistIdFilter" />
                    <SelectTags :initial-tags="[]" @select="filterByTags" />
                </div>
            </div>
        </div>
        <div class="divider"></div>
        <LoadingPlaceholder v-if="tabsStore.loading" />
        <ErrorDisplay v-else-if="tabsStore.error !== null" :message="tabsStore.error" />
        <TabsDisplay v-else :tabs="displayedTabs" />
    </ContentWrapper>
</template>
