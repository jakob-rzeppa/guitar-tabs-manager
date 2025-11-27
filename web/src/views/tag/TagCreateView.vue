<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useTagStore } from '@/stores/tagStore';
import type { Tag } from '@/types/types';
import BaseEditView from '../BaseEditView.vue';
import { createTag } from '@/services/api/tagClient';

const router = useRouter();

const tagStore = useTagStore();

const newTag = ref<Omit<Tag, 'id'>>({
    name: '',
});

const handleSave = async () => {
    if (!newTag.value.name) {
        return;
    }

    await createTag(newTag.value);

    if (!tagStore.error) {
        router.push({ name: 'tagSearch' });
    }
};
</script>

<template>
    <BaseEditView
        elementType="Tag"
        :back-to="{ name: 'tagSearch' }"
        @save="handleSave"
        :is-new-element="true"
    >
        <template #content>
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
        </template>
    </BaseEditView>
</template>
