<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Artist, SheetListItem, Tag } from '@/types/types.ts';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import SheetsDisplay from '@/components/SheetsDisplay.vue';
import calculateSimilarity from '@/services/calculateSimilarity.ts';
import SelectArtist from '@/components/SelectArtist.vue';
import SelectTags from '@/components/SelectTags.vue';
import { useSheetStore } from '@/stores/sheetStore';
import BaseSearchView from '@/views/BaseSearchView.vue';
import { fetchAllSheets } from '@/services/api/sheetClient';

const sheetStore = useSheetStore();

fetchAllSheets();

const searchValue = ref<string>('');
const artistFilter = ref<Artist | null>(null);
const tagsFilter = ref<Tag[]>([]);
const displayedSheets = ref<SheetListItem[]>([]);

watch(
    () => [sheetStore.sheetsList, searchValue.value, artistFilter.value, tagsFilter.value],
    () => {
        if (artistFilter.value === null) {
            displayedSheets.value = [...sheetStore.sheetsList];
        } else {
            displayedSheets.value = sheetStore.sheetsList.filter((sheet) => {
                return (
                    !artistFilter.value ||
                    (sheet.artist !== null && sheet.artist.id === artistFilter.value.id)
                );
            });
        }

        if (tagsFilter.value.length > 0) {
            displayedSheets.value = displayedSheets.value.filter((item) => {
                if (item.tags.length === 0) {
                    return false;
                }

                const itemTagIds = item.tags.map((tag) => tag.id);
                return tagsFilter.value.every((filterTag) => itemTagIds.includes(filterTag.id));
            });
        }

        displayedSheets.value.sort((a, b) => {
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
    <BaseSearchView :create-route="{ name: 'sheetCreate' }">
        <template #title>Search for Sheets</template>
        <template #search-input>
            <input placeholder="Search by title..." v-model="searchValue" />
        </template>
        <template #filters>
            <SelectArtist v-model="artistFilter" />
            <SelectTags v-model="tagsFilter" />
        </template>
        <template #content>
            <LoadingPlaceholder v-if="sheetStore.loading" />
            <ErrorDisplay v-else-if="sheetStore.error !== null" :message="sheetStore.error" />
            <div v-else-if="displayedSheets.length === 0" class="text-center py-16">
                <p class="text-xl opacity-60">No sheets found. Try adjusting your filters.</p>
            </div>
            <SheetsDisplay v-else :sheets="displayedSheets" />
        </template>
    </BaseSearchView>
</template>
