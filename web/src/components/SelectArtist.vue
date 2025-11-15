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
    <div v-else>
        <label class="label">
            <span class="label-text text-base font-semibold">Artist</span>
            <span class="label-text-alt">Select from list</span>
        </label>
        <input
            list="artists"
            type="text"
            placeholder="Start typing to search artists..."
            v-model="inputValue"
            @input="handleInput"
            class="input input-bordered w-full"
        />
        <datalist id="artists">
            <option
                v-for="possibleArtist in artistsStore.artists"
                :key="possibleArtist.id"
                :value="possibleArtist.name"
            />
        </datalist>
    </div>
</template>
