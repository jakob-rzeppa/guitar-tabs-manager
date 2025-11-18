<script setup lang="ts">
import { useRouter } from 'vue-router';
import SelectArtist from '@/components/SelectArtist.vue';
import SelectTags from '@/components/SelectTags.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import { ref } from 'vue';
import { useTabsStore } from '@/stores/tabsStore';
import type { Tab } from '@/types/types';
import { useModalStore } from '@/stores/modalStore';
import CreateArtistModal from '@/components/CreateArtistModal.vue';
import BaseEditView from '../BaseEditView.vue';

const router = useRouter();

const tabsStore = useTabsStore();
const modalStore = useModalStore();

const newTab = ref<Omit<Tab, 'id'>>({
    title: '',
    artist: null,
    tags: [],
    capo: 0,
    sourceURL: '',
    content: '',
});

const handleSave = async () => {
    if (!newTab.value.title || !newTab.value.content) {
        return;
    }

    await tabsStore.createTab(newTab.value);

    if (!tabsStore.error) {
        router.push({ name: 'tabSearch' });
    }
};
</script>

<template>
    <BaseEditView
        elementType="Tab"
        :back-to="{ name: 'tabSearch' }"
        @save="handleSave"
        :is-new-element="true"
    >
        <template #content>
            <!-- Title -->
            <div>
                <label class="label" for="title">
                    <span class="label-text text-base font-semibold">Title</span>
                </label>
                <input
                    id="title"
                    v-model="newTab.title"
                    type="text"
                    required
                    placeholder="Enter tab title"
                    class="input input-bordered input-lg w-full"
                />
            </div>

            <!-- Artist -->
            <div class="space-y-2">
                <SelectArtist v-model="newTab.artist" />

                <button
                    class="btn btn-sm btn-outline btn-secondary w-max"
                    @click="modalStore.openModal(CreateArtistModal)"
                >
                    <PlusIcon />
                    Create new Artist
                </button>
            </div>

            <!-- Tags -->
            <SelectTags v-model="newTab.tags" />

            <!-- Capo -->
            <div>
                <label class="label" for="capo">
                    <span class="label-text text-base font-semibold">Capo</span>
                    <span class="label-text-alt">Fret position (0-12)</span>
                </label>
                <input
                    id="capo"
                    v-model.number="newTab.capo"
                    type="number"
                    min="0"
                    max="12"
                    class="input input-bordered input-lg w-full"
                />
            </div>

            <!-- Source URL -->
            <div>
                <label class="label" for="sourceURL">
                    <span class="label-text text-base font-semibold">Source URL</span>
                </label>
                <input
                    id="sourceURL"
                    v-model="newTab.sourceURL"
                    type="text"
                    required
                    placeholder="Enter source URL"
                    class="input input-bordered input-lg w-full"
                />
            </div>

            <!-- Content (Tab notation) -->
            <div>
                <label class="label" for="content">
                    <span class="label-text text-base font-semibold">Tab Content</span>
                    <span class="label-text-alt">Tab notation goes here</span>
                </label>
                <textarea
                    @keypress.enter.stop=""
                    id="content"
                    v-model="newTab.content"
                    rows="20"
                    required
                    class="textarea textarea-bordered w-full font-mono text-sm h-96"
                    placeholder="Enter tab notation here..."
                ></textarea>
            </div>
        </template>
    </BaseEditView>
</template>
