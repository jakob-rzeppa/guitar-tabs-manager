<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useArtistStore } from '@/stores/artistStore';
import type { Artist } from '@/types/types';
import BaseDeleteView from '../BaseDeleteView.vue';
import PersonIcon from '@/components/icons/PersonIcon.vue';
import { deleteArtist, fetchAllArtists } from '@/services/api/artistClient';

const route = useRoute();
const router = useRouter();
const artistStore = useArtistStore();

const artistId = computed(() => route.params.id as string);
const currentArtist = ref<Artist | null>(null);

onMounted(async () => {
    await fetchAllArtists();
    currentArtist.value =
        artistStore.artists.find((a) => a.id === parseInt(artistId.value)) || null;
});

const handleDelete = async () => {
    await deleteArtist(parseInt(artistId.value));

    if (!artistStore.error) {
        router.push({ name: 'artistSearch' });
    }
};
</script>

<template>
    <BaseDeleteView
        element-type="Artist"
        :back-to="{ name: 'artist', params: { id: artistId } }"
        @delete="handleDelete"
    >
        <template #info-card>
            <h2 class="card-title text-3xl font-bold text-base-content flex items-center gap-4">
                <div class="rounded-full p-3 bg-error">
                    <PersonIcon class="h-6 w-6 text-error-content" />
                </div>
                {{ currentArtist?.name }}
            </h2>
        </template>
    </BaseDeleteView>
</template>
