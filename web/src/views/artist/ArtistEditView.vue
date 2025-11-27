<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useArtistStore } from '@/stores/artistStore';
import type { Artist } from '@/types/types';
import BaseEditView from '../BaseEditView.vue';
import { fetchAllArtists, updateArtist } from '@/services/api/artistClient';

const route = useRoute();
const router = useRouter();
const artistStore = useArtistStore();

const artistId = computed(() => route.params.id as string);

const localArtist = ref<Artist | null>(null);

watch(
    () => artistStore.artists,
    (artists) => {
        const artist = artists.find((a) => a.id === parseInt(artistId.value));
        if (artist) {
            localArtist.value = JSON.parse(JSON.stringify(artist));
        }
    },
    { immediate: true, deep: true },
);

onMounted(() => {
    fetchAllArtists();
});

const handleSave = async () => {
    if (!localArtist.value) return;

    await updateArtist(parseInt(artistId.value), {
        name: localArtist.value.name,
    });

    if (!artistStore.error) {
        router.push({ name: 'artist', params: { id: artistId.value } });
    }
};
</script>

<template>
    <LoadingPlaceholder v-if="artistStore.loading" />
    <ErrorDisplay v-else-if="artistStore.error !== null" :message="artistStore.error" />
    <ErrorDisplay
        v-else-if="localArtist === null"
        message="Something went wrong while loading the artist."
    />
    <BaseEditView
        v-else
        :back-to="{ name: 'artist', params: { id: artistId } }"
        element-type="Artist"
        @save="handleSave"
    >
        <template #content>
            <!-- Name -->
            <div>
                <label class="label" for="name">
                    <span class="label-text text-base font-semibold">Artist Name</span>
                </label>
                <input
                    id="name"
                    v-model="localArtist.name"
                    type="text"
                    required
                    class="input input-bordered w-full input-lg"
                    placeholder="Enter artist name..."
                />
            </div>
        </template>
    </BaseEditView>
</template>
