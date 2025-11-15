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
        <div class="px-8 md:px-14 pt-8 pb-4">
            <h1
                class="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
                Search for Tabs
            </h1>

            <div class="max-w-3xl mx-auto space-y-4">
                <div class="flex gap-3 items-stretch">
                    <label
                        class="input input-bordered input-lg flex items-center gap-2 flex-1 shadow-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            class="grow"
                            placeholder="Search by title..."
                            v-model="searchValue"
                        />
                    </label>

                    <RouterLink to="/tab/create" class="btn btn-primary btn-lg gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Create
                    </RouterLink>
                </div>

                <div tabindex="0" class="collapse collapse-arrow bg-base-200 rounded-box shadow-md">
                    <input type="checkbox" />
                    <div class="collapse-title text-lg font-semibold flex items-center gap-2">
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
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                        Advanced Filters
                    </div>
                    <div class="collapse-content">
                        <div class="flex flex-col gap-4 pt-4">
                            <SelectArtist v-model="artistFilter" />
                            <SelectTags v-model="tagsFilter" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="divider my-2"></div>

        <LoadingPlaceholder v-if="tabsStore.loading" />
        <ErrorDisplay v-else-if="tabsStore.error !== null" :message="tabsStore.error" />
        <div v-else-if="displayedTabs.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4 opacity-20">🎸</div>
            <p class="text-xl opacity-60">No tabs found. Try adjusting your filters.</p>
        </div>
        <TabsDisplay v-else :tabs="displayedTabs" />
    </ContentWrapper>
</template>
