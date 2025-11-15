<script setup lang="ts">
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import { useArtistsStore } from '@/stores/artistsStore';

const model = defineModel<number | null>({ required: true });

const artistsStore = useArtistsStore();

// Initial API call
artistsStore.fetchAllArtists();

function handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    const artistObject = artistsStore.artists.find((e) => e.name === value);

    // If valid artist
    if (artistObject) {
        model.value = artistObject.id;
        return;
    }

    model.value = null;
}
</script>

<template>
    <LoadingPlaceholder v-if="artistsStore.loading" />
    <ErrorDisplay v-else-if="artistsStore.error" :message="artistsStore.error" />
    <ErrorDisplay
        v-else-if="!artistsStore.artists || artistsStore.artists.length === 0"
        message="Something went wrong while retrieving artists."
    />
    <label v-else class="input box-border w-full">
        <span class="label">Artist</span>
        <input list="artists" type="text" placeholder="Type here" @input="handleInput" />
        <datalist id="artists">
            <option v-for="possibleArtist in artistsStore.artists" :value="possibleArtist.name" />
        </datalist>
    </label>
</template>
