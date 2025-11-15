<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Artist, TabListItem, Tag } from '@/types/types.ts';
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
                    <SelectArtist v-model="artistFilter" />
                    <SelectTags v-model="tagsFilter" />
                </div>
            </div>
        </div>
        <div class="divider"></div>
        <LoadingPlaceholder v-if="tabsStore.loading" />
        <ErrorDisplay v-else-if="tabsStore.error !== null" :message="tabsStore.error" />
        <TabsDisplay v-else :tabs="displayedTabs" />
    </ContentWrapper>
</template>
