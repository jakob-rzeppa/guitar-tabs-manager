<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Tag } from '@/types/types.ts';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import calculateSimilarity from '@/services/calculateSimilarity.ts';
import { useTagStore } from '@/stores/tagStore';
import BaseSearchView from '@/views/BaseSearchView.vue';
import { fetchAllTags } from '@/services/api/tagClient';

const tagStore = useTagStore();

onMounted(() => {
    fetchAllTags();
});

const searchValue = ref<string>('');
const displayedTags = ref<Tag[]>([]);

watch(
    () => [tagStore.tags, searchValue.value],
    () => {
        displayedTags.value = [...tagStore.tags];

        displayedTags.value.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return (
                calculateSimilarity(searchValue.value, nameB) -
                calculateSimilarity(searchValue.value, nameA)
            );
        });
    },
    { immediate: true, deep: true },
);
</script>

<template>
    <BaseSearchView :create-route="{ name: 'tagCreate' }">
        <template #title> Search for Tags </template>
        <template #search-input>
            <input placeholder="Search by name..." v-model="searchValue" />
        </template>
        <template #content>
            <LoadingPlaceholder v-if="tagStore.loading" />
            <ErrorDisplay v-else-if="tagStore.error !== null" :message="tagStore.error" />
            <div v-else-if="displayedTags.length === 0" class="text-center py-16">
                <p class="text-xl opacity-60">No tags found. Try adjusting your search.</p>
            </div>
            <div v-else class="max-w-4xl mx-auto px-8 pb-8">
                <ul class="space-y-3">
                    <li v-for="tag in displayedTags" :key="tag.id">
                        <RouterLink
                            :to="{ name: 'tag', params: { id: tag.id } }"
                            class="card bg-base-200 shadow-md hover:shadow-lg hover:bg-base-300 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-primary block"
                        >
                            <div class="card-body py-4 px-6 flex flex-row items-center gap-4">
                                <div class="badge badge-primary badge-lg text-lg px-4 py-3">
                                    #{{ tag.name }}
                                </div>
                            </div>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </template>
    </BaseSearchView>
</template>
