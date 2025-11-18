<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRouter } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackButton from '@/components/BackButton.vue';
import PageHeader from '@/components/PageHeader.vue';
import SaveCancelButtons from '@/components/SaveCancelButtons.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import { ref } from 'vue';
import { useTagsStore } from '@/stores/tagsStore';
import type { Tag } from '@/types/types';

const router = useRouter();

const tagsStore = useTagsStore();

const newTag = ref<Omit<Tag, 'id'>>({
    name: '',
});

const handleSave = async () => {
    if (!newTag.value.name) {
        return;
    }

    await tagsStore.createTag(newTag.value);

    if (!tagsStore.error) {
        router.push({ name: 'tagSearch' });
    }
};

const handleCancel = () => {
    router.push({ name: 'tagSearch' });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-6 md:p-10 max-w-4xl mx-auto">
            <div class="mb-8">
                <BackButton :on-click="handleCancel" class="mb-4" />
                <PageHeader title="Create Tag" icon-color="primary">
                    <template #icon>
                        <PlusIcon class="h-8 w-8 text-primary-content" />
                    </template>
                </PageHeader>
            </div>

            <ErrorDisplay v-if="tagsStore.error !== null" :message="tagsStore.error" />

            <div @keypress.enter="handleSave" class="flex flex-col gap-4">
                <!-- Tag Name -->
                <div>
                    <label class="label" for="name">
                        <span class="label-text text-base font-semibold">Tag Name</span>
                    </label>
                    <input
                        id="name"
                        v-model="newTag.name"
                        type="text"
                        required
                        placeholder="Enter tag name"
                        class="input input-bordered input-lg w-full"
                    />
                </div>

                <!-- Action Buttons -->
                <SaveCancelButtons :on-save="handleSave" :on-cancel="handleCancel" class="pt-4" />
            </div>
        </div>
    </ContentWrapper>
</template>
