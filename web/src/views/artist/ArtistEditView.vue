<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackButton from '@/components/BackButton.vue';
import PageHeader from '@/components/PageHeader.vue';
import SaveCancelButtons from '@/components/SaveCancelButtons.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useArtistsStore } from '@/stores/artistsStore';
import type { Artist } from '@/types/types';

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

const handleCancel = () => {
    router.push({ name: 'artist', params: { id: artistId.value } });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-6 md:p-10 max-w-4xl mx-auto">
            <div class="mb-8">
                <BackButton :on-click="handleCancel" class="mb-4" />
                <PageHeader title="Edit Artist" icon-color="primary">
                    <template #icon>
                        <EditIcon class="h-8 w-8 text-primary-content" />
                    </template>
                </PageHeader>
            </div>

            <LoadingPlaceholder v-if="artistsStore.loading" />
            <ErrorDisplay v-else-if="artistsStore.error !== null" :message="artistsStore.error" />
            <ErrorDisplay
                v-else-if="localArtist === null"
                message="Something went wrong while loading the artist."
            />

            <div v-else @keypress.enter="handleSave" class="space-y-6">
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

                <!-- Action Buttons -->
                <SaveCancelButtons :on-save="handleSave" :on-cancel="handleCancel" />
            </div>
        </div>
    </ContentWrapper>
</template>
