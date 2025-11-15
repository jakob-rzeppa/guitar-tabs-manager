<script setup lang="ts">
import api, { useApi } from '@/services/api.ts';
import type { APIResponse, Artist } from '@/types/types.ts';
import { ref } from 'vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';

interface Props {
    artist: Artist | null;
}

defineProps<Props>();

const emit = defineEmits(['select']);

const loading = ref(false);
const response = ref<APIResponse<Artist[]> | null>(null);
const error = ref<string | null>(null);
const apiCall = () => api.get('/artists');

useApi<Artist[]>({ loading, error, response, apiCall });

function handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (!response.value || !response.value.content) {
        return;
    }

    const artistObject = response.value.content.find((e) => e.name === value);

    // If valid artist
    if (artistObject) {
        emit('select', artistObject);
        return;
    }

    emit('select', null);
}
</script>

<template>
    <LoadingPlaceholder v-if="loading" />
    <ErrorDisplay v-else-if="error" :message="error" />
    <ErrorDisplay
        v-else-if="!response || !response.content"
        message="Something went wrong while retrieving artists."
    />
    <label v-else class="input box-border w-full">
        <span class="label">Artist</span>
        <input
            list="artists"
            type="text"
            placeholder="Type here"
            :value="artist ? artist.name : ''"
            @input="handleInput"
        />
        <datalist id="artists">
            <option v-for="possibleArtist in response.content" :value="possibleArtist.name" />
        </datalist>
    </label>
</template>
