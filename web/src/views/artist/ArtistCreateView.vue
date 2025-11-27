<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useArtistStore } from '@/stores/artistStore';
import type { Artist } from '@/types/types';
import BaseEditView from '../BaseEditView.vue';
import { createArtist } from '@/services/api/artistClient';

const router = useRouter();
const artistStore = useArtistStore();

const localArtist = ref<Omit<Artist, 'id'>>({
    name: '',
});

const handleSave = async () => {
    if (!localArtist.value) return;

    await createArtist(localArtist.value);

    if (!artistStore.error) {
        router.push({ name: 'artistSearch' });
    }
};
</script>

<template>
    <BaseEditView
        :back-to="{ name: 'artistSearch' }"
        element-type="Artist"
        @save="handleSave"
        :is-new-element="true"
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
