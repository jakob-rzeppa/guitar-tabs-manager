<script setup lang="ts">
import { useRoute } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import SheetsDisplay from '@/components/SheetsDisplay.vue';
import BackLink from '@/components/BackLink.vue';
import { useArtistsStore } from '@/stores/artistsStore';
import { useSheetsStore } from '@/stores/sheetsStore';
import { computed, onMounted, ref } from 'vue';
import type { Artist, SheetListItem } from '@/types/types';
import PersonIcon from '@/components/icons/PersonIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import BaseView from '../BaseView.vue';
import { fetchAllArtists } from '@/services/api/artistClient';

const route = useRoute();
const artistsStore = useArtistsStore();
const sheetsStore = useSheetsStore();

const artistId = computed(() => route.params.id as string);
const currentArtist = ref<Artist | null>(null);
const artistSheets = ref<SheetListItem[]>([]);

onMounted(async () => {
    await fetchAllArtists();
    await sheetsStore.fetchAllSheets();

    currentArtist.value =
        artistsStore.artists.find((a) => a.id === parseInt(artistId.value)) || null;

    if (currentArtist.value) {
        artistSheets.value = sheetsStore.sheetsList.filter(
            (sheet) => sheet.artist && sheet.artist.id === currentArtist.value!.id,
        );
    }
});
</script>

<template>
    <LoadingPlaceholder v-if="artistsStore.loading || sheetsStore.loading" />
    <ErrorDisplay
        v-else-if="artistsStore.error || sheetsStore.error"
        :message="artistsStore.error || sheetsStore.error || ''"
    />
    <ErrorDisplay v-else-if="!currentArtist" message="Artist not found." />
    <BaseView v-else>
        <template #above-header>
            <BackLink :to="{ name: 'artistSearch' }" display-text="Artist Search" />
        </template>
        <template #header>
            <div class="flex items-center gap-4">
                <div class="bg-primary rounded-full p-4">
                    <PersonIcon class="h-8 w-8 text-primary-content" />
                </div>
                <h1 class="text-4xl md:text-5xl font-bold">
                    {{ currentArtist.name }}
                </h1>
            </div>
        </template>
        <template #subheader>
            <div class="stats shadow bg-base-200">
                <div class="stat">
                    <div class="stat-title">Total Sheets</div>
                    <div class="stat-value text-primary">{{ artistSheets.length }}</div>
                </div>
            </div>
        </template>
        <template #actions>
            <RouterLink class="btn btn-primary gap-2" :to="`/artist/${artistId}/edit`">
                <EditIcon />
                Edit
            </RouterLink>
            <RouterLink class="btn btn-error gap-2" :to="`/artist/${artistId}/delete`">
                <DeleteIcon />
                Delete
            </RouterLink>
        </template>
        <template #content>
            <div v-if="artistSheets.length === 0" class="text-center py-16">
                <p class="text-xl opacity-60">No sheets found for this artist.</p>
            </div>
            <div v-else>
                <h2 class="text-2xl font-bold mb-4">Sheets by {{ currentArtist.name }}</h2>
                <SheetsDisplay :sheets="artistSheets" />
            </div>
        </template>
    </BaseView>
</template>
