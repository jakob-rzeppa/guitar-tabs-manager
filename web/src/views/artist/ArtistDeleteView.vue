<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackButton from '@/components/BackButton.vue';
import PageHeader from '@/components/PageHeader.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';
import XIcon from '@/components/icons/XIcon.vue';
import { computed, onMounted, ref } from 'vue';
import { useArtistsStore } from '@/stores/artistsStore';
import type { Artist } from '@/types/types';

const route = useRoute();
const router = useRouter();
const artistsStore = useArtistsStore();

const artistId = computed(() => route.params.id as string);
const currentArtist = ref<Artist | null>(null);

onMounted(async () => {
    await artistsStore.fetchAllArtists();
    currentArtist.value =
        artistsStore.artists.find((a) => a.id === parseInt(artistId.value)) || null;
});

const handleDelete = async () => {
    await artistsStore.deleteArtist(parseInt(artistId.value));

    if (!artistsStore.error) {
        router.push({ name: 'artistSearch' });
    }
};

const handleCancel = () => {
    router.push({ name: 'artist', params: { id: artistId.value } });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-6 md:p-10 max-w-4xl mx-auto">
            <div class="mb-8">
                <BackButton :on-click="handleCancel" class="mb-4" />
                <PageHeader title="Delete Artist" icon-color="error">
                    <template #icon>
                        <DeleteIcon class="h-8 w-8 text-error-content" />
                    </template>
                </PageHeader>
            </div>

            <LoadingPlaceholder v-if="artistsStore.loading" />
            <ErrorDisplay v-else-if="artistsStore.error" :message="artistsStore.error" />
            <ErrorDisplay
                v-else-if="!currentArtist"
                message="Something went wrong while loading the artist."
            />

            <div v-else class="space-y-6">
                <div class="alert alert-warning shadow-lg">
                    <WarningIcon />
                    <div>
                        <h3 class="font-bold">Warning!</h3>
                        <div class="text-sm">
                            This action cannot be undone. This will permanently delete the artist.
                        </div>
                    </div>
                </div>

                <div class="card bg-base-200 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title text-2xl mb-2">{{ currentArtist.name }}</h2>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button @click="handleDelete" class="btn btn-error btn-lg gap-2">
                        <DeleteIcon />
                        Delete Artist
                    </button>
                    <button
                        type="button"
                        @click="handleCancel"
                        class="btn btn-outline btn-lg gap-2"
                    >
                        <XIcon />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
