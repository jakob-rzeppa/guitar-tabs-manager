<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Artist } from '@/types/types.ts';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import calculateSimilarity from '@/services/calculateSimilarity.ts';
import { useArtistsStore } from '@/stores/artistsStore';
import PersonIcon from '@/components/icons/PersonIcon.vue';
import BaseSearchView from '@/views/BaseSearchView.vue';

const artistsStore = useArtistsStore();

artistsStore.fetchAllArtists();

const searchValue = ref<string>('');
const displayedArtists = ref<Artist[]>([]);

watch(
    () => [artistsStore.artists, searchValue.value],
    () => {
        displayedArtists.value = [...artistsStore.artists];

        displayedArtists.value.sort((a, b) => {
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
    <BaseSearchView>
        <template #title> Search for Artists </template>
        <template #search-input>
            <input placeholder="Search by name..." v-model="searchValue" />
        </template>
        <template #content>
            <LoadingPlaceholder v-if="artistsStore.loading" />
            <ErrorDisplay v-else-if="artistsStore.error !== null" :message="artistsStore.error" />
            <div v-else-if="displayedArtists.length === 0" class="text-center py-16">
                <p class="text-xl opacity-60">No artists found. Try adjusting your search.</p>
            </div>
            <div v-else class="max-w-4xl mx-auto px-8 pb-8">
                <ul class="space-y-3">
                    <li v-for="artist in displayedArtists" :key="artist.id">
                        <RouterLink
                            :to="{ name: 'artist', params: { id: artist.id } }"
                            class="card bg-base-200 shadow-md hover:shadow-lg hover:bg-base-300 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-primary block"
                        >
                            <div class="card-body py-4 px-6 flex flex-row items-center gap-4">
                                <div class="bg-primary rounded-full p-3">
                                    <PersonIcon class="h-6 w-6 text-primary-content" />
                                </div>
                                <h2 class="text-xl font-semibold">
                                    {{ artist.name }}
                                </h2>
                            </div>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </template>
    </BaseSearchView>
</template>
