<script setup lang="ts">
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import { useArtistsStore } from '@/stores/artistsStore';
import { onMounted, ref, watch } from 'vue';
import type { Artist } from '@/types/types';

const model = defineModel<Artist | null>({ required: true });

const artistsStore = useArtistsStore();

const inputValue = ref<string>(model.value ? model.value.name : '');

onMounted(async () => {
    await artistsStore.fetchAllArtists();
});

function handleInput() {
    const artistObject = artistsStore.artists.find((e) => e.name === inputValue.value);

    // If valid artist
    if (artistObject) {
        // Deep copy to avoid mutating store state
        model.value = JSON.parse(JSON.stringify(artistObject));
        return;
    }

    model.value = null;
}
</script>

<template>
    <LoadingPlaceholder v-if="artistsStore.loading" />
    <ErrorDisplay v-else-if="artistsStore.error" :message="artistsStore.error" />
    <label v-else class="input box-border w-full">
        <span class="label">Artist</span>
        <input
            list="artists"
            type="text"
            placeholder="Type here"
            v-model="inputValue"
            @input="handleInput"
        />
        <datalist id="artists">
            <option v-for="possibleArtist in artistsStore.artists" :value="possibleArtist.name" />
        </datalist>
    </label>
</template>
