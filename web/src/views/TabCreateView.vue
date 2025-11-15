<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRouter } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import SelectArtist from '@/components/SelectArtist.vue';
import SelectTags from '@/components/SelectTags.vue';
import BackButton from '@/components/BackButton.vue';
import PageHeader from '@/components/PageHeader.vue';
import SaveCancelButtons from '@/components/SaveCancelButtons.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import { ref } from 'vue';
import { useTabsStore } from '@/stores/tabsStore';
import type { Tab } from '@/types/types';

const router = useRouter();
const tabsStore = useTabsStore();

const newTab = ref<Omit<Tab, 'id'>>({
    title: '',
    artist: null,
    tags: [],
    capo: 0,
    content: '',
});

const handleSave = async () => {
    if (!newTab.value.title || !newTab.value.content) {
        return;
    }

    console.log('Creating tab:', newTab.value);
    await tabsStore.createTab(newTab.value);

    if (!tabsStore.error) {
        router.push({ name: 'tabSearch' });
    }
};

const handleCancel = () => {
    router.push({ name: 'tabSearch' });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-6 md:p-10 max-w-4xl mx-auto">
            <div class="mb-8">
                <BackButton :on-click="handleCancel" class="mb-4" />
                <PageHeader title="Create Tab" icon-color="primary">
                    <template #icon>
                        <PlusIcon class="h-8 w-8 text-primary-content" />
                    </template>
                </PageHeader>
            </div>

            <ErrorDisplay v-if="tabsStore.error !== null" :message="tabsStore.error" />

            <div @keypress.enter="handleSave" class="space-y-6">
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
                <SelectArtist v-model="newTab.artist" />

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

                <!-- Action Buttons -->
                <SaveCancelButtons :on-save="handleSave" :on-cancel="handleCancel" class="pt-4" />
            </div>
        </div>
    </ContentWrapper>
</template>
