<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import { computed, onMounted, ref } from 'vue';
import { useTagStore } from '@/stores/tagStore';
import type { Tag } from '@/types/types';
import BaseDeleteView from '../BaseDeleteView.vue';
import TagIcon from '@/components/icons/TagIcon.vue';
import { deleteTag, fetchAllTags } from '@/services/api/tagClient';

const route = useRoute();
const router = useRouter();
const tagStore = useTagStore();

const tagId = computed(() => route.params.id as string);
const currentTag = ref<Tag | null>(null);

onMounted(async () => {
    await fetchAllTags();
    currentTag.value = tagStore.tags.find((t) => t.id === parseInt(tagId.value)) || null;
});

const handleDelete = async () => {
    await deleteTag(parseInt(tagId.value));

    if (!tagStore.error) {
        router.push({ name: 'tagSearch' });
    }
};
</script>

<template>
    <LoadingPlaceholder v-if="tagStore.loading" />
    <ErrorDisplay v-else-if="tagStore.error" :message="tagStore.error" />
    <ErrorDisplay v-else-if="!currentTag" message="Something went wrong while loading the tag." />
    <BaseDeleteView
        v-else
        element-type="Tag"
        :back-to="{ name: 'tagSearch' }"
        @delete="handleDelete"
    >
        <template #info-card>
            <h2 class="card-title text-3xl font-bold text-base-content flex items-center gap-4">
                <div class="rounded-full p-3 bg-error">
                    <TagIcon class="h-6 w-6 text-error-content" />
                </div>
                {{ currentTag.name }}
            </h2>
        </template>
    </BaseDeleteView>
</template>
