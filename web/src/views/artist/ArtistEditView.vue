<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useArtistsStore } from '@/stores/artistsStore';
import type { Artist } from '@/types/types';
import BaseEditView from '../BaseEditView.vue';

const route = useRoute();
const router = useRouter();
const artistsStore = useArtistsStore();

const artistId = computed(() => route.params.id as string);

const localArtist = ref<Artist | null>(null);

watch(
    () => artistsStore.artists,
    (artists) => {
        const artist = artists.find((a) => a.id === parseInt(artistId.value));
        if (artist) {
            localArtist.value = JSON.parse(JSON.stringify(artist));
        }
    },
    { immediate: true, deep: true },
);

onMounted(() => {
    artistsStore.fetchAllArtists();
});

const handleSave = async () => {
    if (!localArtist.value) return;

    await artistsStore.updateArtist(parseInt(artistId.value), {
        name: localArtist.value.name,
    });

    if (!artistsStore.error) {
        router.push({ name: 'artist', params: { id: artistId.value } });
    }
};
</script>

<template>
    <LoadingPlaceholder v-if="artistsStore.loading" />
    <ErrorDisplay v-else-if="artistsStore.error !== null" :message="artistsStore.error" />
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
