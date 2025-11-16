<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Artist } from '@/types/types.ts';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import calculateSimilarity from '@/services/calculateSimilarity.ts';
import { useArtistsStore } from '@/stores/artistsStore';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import PersonIcon from '@/components/icons/PersonIcon.vue';

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
    <ContentWrapper>
        <div class="px-8 md:px-14 pt-8 pb-4">
            <h1
                class="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
                Search for Artists
            </h1>

            <div class="max-w-3xl mx-auto space-y-4">
                <div class="flex gap-3 items-stretch">
                    <label
                        class="input input-bordered input-lg flex items-center gap-2 flex-1 shadow-md"
                    >
                        <SearchIcon class="opacity-70 w-5 h-5" />
                        <input
                            type="text"
                            class="grow"
                            placeholder="Search by name..."
                            v-model="searchValue"
                        />
                    </label>

                    <button class="btn btn-primary btn-lg gap-2">
                        <PlusIcon class="h-6 w-6" />
                        Create
                    </button>
                </div>
            </div>
        </div>

        <div class="divider my-2"></div>

        <LoadingPlaceholder v-if="artistsStore.loading" />
        <ErrorDisplay v-else-if="artistsStore.error !== null" :message="artistsStore.error" />
        <div v-else-if="displayedArtists.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4 opacity-20">🎤</div>
            <p class="text-xl opacity-60">No artists found. Try adjusting your search.</p>
        </div>
        <div v-else class="max-w-4xl mx-auto px-8 pb-8">
            <ul class="space-y-3">
                <li v-for="artist in displayedArtists" :key="artist.id">
                    <div
                        class="card bg-base-200 shadow-md hover:shadow-lg hover:bg-base-300 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-primary"
                    >
                        <div class="card-body py-4 px-6 flex flex-row items-center gap-4">
                            <div class="bg-primary rounded-full p-2">
                                <PersonIcon class="h-5 w-5 text-primary-content" />
                            </div>
                            <h2 class="text-xl font-semibold">
                                {{ artist.name }}
                            </h2>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </ContentWrapper>
</template>
